using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Role.Student)] // Strictly restricted to Student role
public class StudentController : ControllerBase
{
    private readonly MongoDbContext _context;

    public StudentController(MongoDbContext context)
    {
        _context = context;
    }

    // 1. GET: api/student/me
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var studentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(studentId)) return Unauthorized();

        var student = await _context.Users
            .Find(u => u.Id == studentId && u.Role == Role.Student)
            .FirstOrDefaultAsync();

        if (student == null) return NotFound(new { message = "Student profile not found." });

        Course? course = null;
        if (!string.IsNullOrEmpty(student.CourseId))
        {
            course = await _context.Courses.Find(c => c.Id == student.CourseId).FirstOrDefaultAsync();
        }

        return Ok(new
        {
            id = student.Id,
            name = student.Name,
            email = student.Email,
            role = student.Role,
            courseId = student.CourseId,
            courseName = course?.Name,
            courseNameBn = course?.NameBn
        });
    }

    // 2. GET: api/student/subjects
    [HttpGet("subjects")]
    public async Task<IActionResult> GetMySubjects()
    {
        var studentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var student = await _context.Users.Find(u => u.Id == studentId).FirstOrDefaultAsync();
        if (student == null || string.IsNullOrEmpty(student.CourseId)) 
            return BadRequest(new { message = "Student has no course assignment." });

        // Retrieve subjects in student's course
        var subjects = await _context.Subjects
            .Find(s => s.CourseId == student.CourseId)
            .ToListAsync();

        var allTeacherIds = subjects
            .Where(s => s.TeacherIds != null)
            .SelectMany(s => s.TeacherIds)
            .Distinct()
            .ToList();

        // Join teachers
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

        var data = subjects.Select(s => new
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

        return Ok(data);
    }

    // 3. GET: api/student/assignments (Eliminates N+1 query issue)
    [HttpGet("assignments")]
    public async Task<IActionResult> GetMyAssignmentsAndSubmissions()
    {
        var studentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var student = await _context.Users.Find(u => u.Id == studentId).FirstOrDefaultAsync();
        if (student == null || string.IsNullOrEmpty(student.CourseId)) 
            return BadRequest(new { message = "Student has no course assignment." });

        // Resolve active course subjects
        var subjectIds = await _context.Subjects
            .Find(s => s.CourseId == student.CourseId)
            .Project(s => s.Id)
            .ToListAsync();

        // Get all published assignments
        var assignments = await _context.Assignments
            .Find(a => a.IsPublished && subjectIds.Contains(a.SubjectId))
            .ToListAsync();

        var assignmentIds = assignments.Select(a => a.Id).ToList();

        // Get student's corresponding submissions
        var submissions = await _context.Submissions
            .Find(s => s.StudentId == studentId && assignmentIds.Contains(s.AssignmentId))
            .ToListAsync();

        var submissionMap = submissions.ToDictionary(s => s.AssignmentId, s => s);

        var data = assignments.Select(asg => {
            submissionMap.TryGetValue(asg.Id?? string.Empty, out var sub);
            return new
            {
                assignment = asg,
                submission = sub != null ? new {
                    id = sub.Id,
                    submittedAt = sub.SubmittedAt,
                    answer = sub.Answer,
                    attachmentUrl = sub.AttachmentUrl,
                    status = sub.Status,
                    marks = sub.Marks,
                    feedback = sub.Feedback
                } : null
            };
        }).ToList();

        return Ok(data);
    }

    // 4. GET: api/student/classmates
    [HttpGet("classmates")]
    public async Task<IActionResult> GetMyClassmates(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var studentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var student = await _context.Users.Find(u => u.Id == studentId).FirstOrDefaultAsync();
        if (student == null || string.IsNullOrEmpty(student.CourseId)) 
            return BadRequest(new { message = "Student has no course assignment." });

        var filterBuilder = Builders<User>.Filter;
        var filters = new List<FilterDefinition<User>>
        {
            filterBuilder.Eq(u => u.Role, Role.Student),
            filterBuilder.Eq(u => u.CourseId, student.CourseId),
            filterBuilder.Ne(u => u.Id, studentId) // Exclude current user
        };

        if (!string.IsNullOrEmpty(search))
        {
            var searchRegex = new BsonRegularExpression(search, "i");
            filters.Add(filterBuilder.Or(
                filterBuilder.Regex(u => u.Name, searchRegex),
                filterBuilder.Regex(u => u.Email, searchRegex)
            ));
        }

        var finalFilter = filterBuilder.And(filters);
        var totalCount = await _context.Users.CountDocumentsAsync(finalFilter);

        var classmates = await _context.Users.Find(finalFilter)
            .Project(u => new { u.Id, u.Name, u.Email })
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        return Ok(new
        {
            data = classmates,
            page,
            totalPage = (int)Math.Ceiling((double)totalCount / pageSize),
            totalCount
        });
        
    }// GET: api/student/teachers
[HttpGet("teachers")]
public async Task<IActionResult> GetMyTeachers()
{
    var studentId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(studentId)) return Unauthorized();

    // 1. Find the logged-in student
    var student = await _context.Users
        .Find(u => u.Id == studentId && u.Role == Role.Student)
        .FirstOrDefaultAsync();

    if (student == null || string.IsNullOrEmpty(student.CourseId))
    {
        return BadRequest(new { message = "Student has no course assignment." });
    }

    // 2. Retrieve all subjects belonging to the student's CourseId
    var subjects = await _context.Subjects
        .Find(s => s.CourseId == student.CourseId)
        .ToListAsync();

    // 3. Extract distinct TeacherIds from those subjects
    var teacherIds = subjects
        .Where(s => s.TeacherIds != null)
        .SelectMany(s => s.TeacherIds)
        .Distinct()
        .ToList();

    if (teacherIds.Count == 0)
    {
        return Ok(new List<object>()); // Return empty list safely if no teachers are assigned
    }

    // 4. Retrieve the profiles of those distinct teachers
    var teachers = await _context.Users
        .Find(u => u.Role == Role.Teacher && u.Id != null && teacherIds.Contains(u.Id))
        .Project(u => new 
        {
            id = u.Id,
            name = u.Name,
            email = u.Email,
            specialties = u.Specialties,
            versions = u.Versions,
            levels = u.Levels
        })
        .ToListAsync();

    return Ok(teachers);
}
}