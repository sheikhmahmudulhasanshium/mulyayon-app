using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublicController : ControllerBase
{
    private readonly MongoDbContext _context;

    public PublicController(MongoDbContext context)
    {
        _context = context;
    }

    // 1. GET: api/public/courses/{version} (e.g. /api/public/courses/Bangla)
    [HttpGet("courses/{version}")]
    public async Task<IActionResult> GetAllCourses(string version)
    {
        var courses = await _context.Courses
            .Find(c => c.Version.ToLower() == version.ToLower())
            .ToListAsync();

        return Ok(courses);
    }

    // 2. GET: api/public/subjects/{version} (e.g. /api/public/subjects/Bangla)
    [HttpGet("subjects/{version}")]
    public async Task<IActionResult> GetAllSubjects(string version)
    {
        // Find all courses matching the version first
        var courseIds = await _context.Courses
            .Find(c => c.Version.ToLower() == version.ToLower())
            .Project(c => c.Id)
            .ToListAsync();

        // Get all subjects belonging to those courses
        var subjects = await _context.Subjects
            .Find(s => courseIds.Contains(s.CourseId))
            .ToListAsync();

        return Ok(subjects);
    }

    // 3. GET: api/public/subjects/{level}/{version} (e.g. /api/public/subjects/Primary/Bangla)
    [HttpGet("subjects/{level}/{version}")]
    public async Task<IActionResult> GetAllSubjectsByLevel(string level, string version)
    {
        // Find courses matching both Level and Version
        var courseIds = await _context.Courses
            .Find(c => c.Level.ToLower() == level.ToLower() && c.Version.ToLower() == version.ToLower())
            .Project(c => c.Id)
            .ToListAsync();

        // Retrieve subjects
        var subjects = await _context.Subjects
            .Find(s => courseIds.Contains(s.CourseId))
            .ToListAsync();

        return Ok(subjects);
    }

    // 4. GET: api/public/subjects-by-course/{courseId} (For cascading frontend menus)
    [HttpGet("subjects-by-course/{courseId}")]
    public async Task<IActionResult> GetSubjectsByCourse(string courseId)
    {
        var subjects = await _context.Subjects
            .Find(s => s.CourseId == courseId)
            .ToListAsync();

        return Ok(subjects);
    }

    // GET: api/public/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetPublicStats()
    {
        var totalCourses = await _context.Courses.CountDocumentsAsync(Builders<Course>.Filter.Empty);
        var totalSubjects = await _context.Subjects.CountDocumentsAsync(Builders<Subject>.Filter.Empty);
        
        var totalTeachers = await _context.Users.CountDocumentsAsync(u => u.Role == Role.Teacher);
        var totalStudents = await _context.Users.CountDocumentsAsync(u => u.Role == Role.Student);

        var publicStats = new
        {
            totalStudents,
            totalTeachers,
            totalCourses,
            totalSubjects
        };

        return Ok(publicStats);
    }

    // ==========================================
    // EXTENDED/ADVENTURE ENDPOINTS
    // ==========================================

    [HttpGet("stats/detailed")]
    public async Task<IActionResult> GetDetailedPublicStats()
    {
        var totalCourses = await _context.Courses.CountDocumentsAsync(Builders<Course>.Filter.Empty);
        var totalSubjects = await _context.Subjects.CountDocumentsAsync(Builders<Subject>.Filter.Empty);
        var totalTeachers = await _context.Users.CountDocumentsAsync(u => u.Role == Role.Teacher);
        var totalStudents = await _context.Users.CountDocumentsAsync(u => u.Role == Role.Student);

        var primaryCoursesCount = await _context.Courses.CountDocumentsAsync(c => c.Level == "Primary");
        var secondaryCoursesCount = await _context.Courses.CountDocumentsAsync(c => c.Level == "Secondary");
        var higherSecondaryCoursesCount = await _context.Courses.CountDocumentsAsync(c => c.Level == "Higher Secondary");

        var banglaCoursesCount = await _context.Courses.CountDocumentsAsync(c => c.Version == "Bangla");
        var englishCoursesCount = await _context.Courses.CountDocumentsAsync(c => c.Version == "English");

        return Ok(new
        {
            summary = new
            {
                totalStudents,
                totalTeachers,
                totalCourses,
                totalSubjects
            },
            byLevel = new
            {
                primaryCourses = primaryCoursesCount,
                secondaryCourses = secondaryCoursesCount,
                higherSecondaryCourses = higherSecondaryCoursesCount
            },
            byVersion = new
            {
                banglaVersionCourses = banglaCoursesCount,
                englishVersionCourses = englishCoursesCount
            }
        });
    }

    [HttpGet("directory/courses")]
    public async Task<IActionResult> GetCoursesForAdventure(
        [FromQuery] string version,
        [FromQuery] string level,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 12;

        string normVersion = version.Equals("BV", StringComparison.OrdinalIgnoreCase) || 
                             version.Contains("Bangla", StringComparison.OrdinalIgnoreCase) 
                             ? "Bangla" : "English";

        var filterBuilder = Builders<Course>.Filter;
        var filter = filterBuilder.And(
            filterBuilder.Eq(c => c.Version, normVersion),
            filterBuilder.Regex(c => c.Level, new BsonRegularExpression($"^{level}$", "i"))
        );

        var totalCount = await _context.Courses.CountDocumentsAsync(filter);
        
        var courses = await _context.Courses.Find(filter)
            .SortBy(c => c.Order)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        var totalPage = (int)Math.Ceiling((double)totalCount / pageSize);

        return Ok(new
        {
            data = courses,
            page,
            totalPage,
            totalCount
        });
    }

    [HttpGet("directory/subjects-with-teachers/{courseId}")]
    public async Task<IActionResult> GetSubjectsWithTeachers(string courseId)
    {
        var subjects = await _context.Subjects
            .Find(s => s.CourseId == courseId)
            .ToListAsync();

        var allTeacherIds = subjects
            .Where(s => s.TeacherIds != null)
            .SelectMany(s => s.TeacherIds)
            .Distinct()
            .ToList();

        var teachers = await _context.Users
            .Find(u => u.Role == Role.Teacher && u.Id != null && allTeacherIds.Contains(u.Id))
            .Project(u => new 
            {
                id = u.Id,
                name = u.Name,
                specialties = u.Specialties
            })
            .ToListAsync();

        var teacherMap = teachers.ToDictionary(t => t.id!, t => t);

        var result = subjects.Select(s => new
        {
            id = s.Id,
            name = s.Name,
            nameBn = s.NameBn,
            courseId = s.CourseId,
            teachers = (s.TeacherIds ?? new List<string>())
                .Where(id => id != null && teacherMap.ContainsKey(id))
                .Select(id => teacherMap[id])
                .ToList()
        }).ToList();

        return Ok(result);
    }
}