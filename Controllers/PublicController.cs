using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

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
}