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
[Authorize(Roles = Role.Teacher)]
public class TeacherController : ControllerBase
{
    private readonly MongoDbContext _context;

    public TeacherController(MongoDbContext context)
    {
        _context = context;
    }

    // Helper to generate a type-agnostic filter matching both plain strings and BSON ObjectIds
    private FilterDefinition<Subject> GetTeacherAssignmentFilter(string teacherId)
    {
        var filterBuilder = Builders<Subject>.Filter;
        var hasValidObjectId = ObjectId.TryParse(teacherId, out var objId);

        var filters = new List<FilterDefinition<Subject>>
        {
            filterBuilder.AnyEq("teacherIds", teacherId)
        };

        if (hasValidObjectId)
        {
            filters.Add(filterBuilder.AnyEq("teacherIds", objId));
        }

        return filterBuilder.Or(filters);
    }

    // GET: api/teacher/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetTeacherStats()
    {
        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        // Use the type-agnostic assignment filter
        var subjects = await _context.Subjects
            .Find(GetTeacherAssignmentFilter(teacherId))
            .ToListAsync();

        var courseIds = subjects.Select(s => s.CourseId).Distinct().ToList();

        var totalClassesToTake = courseIds.Count;
        var totalStudentsInClasses = await _context.Users
            .CountDocumentsAsync(u => u.Role == Role.Student && u.CourseId != null && courseIds.Contains(u.CourseId));

        var assignments = await _context.Assignments.Find(a => a.TeacherId == teacherId).ToListAsync();
        var assignmentIds = assignments.Select(a => a.Id).ToList();

        var submissions = await _context.Submissions
            .Find(s => s.AssignmentId != null && assignmentIds.Contains(s.AssignmentId))
            .ToListAsync();

        var received = submissions.Count;
        var pending = submissions.Count(s => s.Status == "Pending");
        var rejected = submissions.Count(s => s.Status == "Rejected");

        var grades = new Dictionary<string, int>
        {
            { "A+", 0 }, { "A", 0 }, { "A-", 0 }, { "B", 0 }, { "C", 0 }, { "D", 0 }, { "F", 0 }
        };

        foreach (var sub in submissions.Where(s => s.Status == "Graded"))
        {
            var assignment = assignments.FirstOrDefault(a => a.Id == sub.AssignmentId);
            if (assignment == null || assignment.MaxMarks <= 0) continue;

            if (!sub.Marks.HasValue) continue;
            double percentage = (sub.Marks.Value / assignment.MaxMarks) * 100;

            if (percentage >= 80) grades["A+"]++;
            else if (percentage >= 70) grades["A"]++;
            else if (percentage >= 60) grades["A-"]++;
            else if (percentage >= 50) grades["B"]++;
            else if (percentage >= 40) grades["C"]++;
            else if (percentage >= 33) grades["D"]++;
            else grades["F"]++;
        }

        var teacherStats = new
        {
            totalClassesToTake,
            totalStudentsInClasses,
            assignments = new
            {
                totalCreated = assignments.Count,
                submissionsReceived = received,
                submissionsPending = pending,
                submissionsRejected = rejected
            },
            classPerformance = grades
        };

        return Ok(teacherStats);
    }

    // GET: api/teacher/students-by-class/{courseId}
    [HttpGet("students-by-class/{courseId}")]
    public async Task<IActionResult> GetStudentsByClass(string courseId)
    {
        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        var filterBuilder = Builders<Subject>.Filter;
        var filter = filterBuilder.And(
            filterBuilder.Eq(s => s.CourseId, courseId),
            GetTeacherAssignmentFilter(teacherId)
        );

        var teachesThisCourse = await _context.Subjects.Find(filter).AnyAsync();

        if (!teachesThisCourse)
        {
            return Forbid();
        }

        var students = await _context.Users
            .Find(u => u.Role == Role.Student && u.CourseId == courseId)
            .ToListAsync();

        return Ok(students);
    }

    // GET: api/teacher/students/{studentId}
    [HttpGet("students/{studentId}")]
    public async Task<IActionResult> GetStudentById(string studentId)
    {
        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        var student = await _context.Users
            .Find(u => u.Id == studentId && u.Role == Role.Student)
            .FirstOrDefaultAsync();

        if (student == null) return NotFound(new { message = "Student not found" });

        var filterBuilder = Builders<Subject>.Filter;
        var filter = filterBuilder.And(
            filterBuilder.Eq(s => s.CourseId, student.CourseId),
            GetTeacherAssignmentFilter(teacherId)
        );

        var teachesStudent = await _context.Subjects.Find(filter).AnyAsync();

        if (!teachesStudent)
        {
            return Forbid();
        }

        return Ok(student);
    }

    // GET: api/teacher/students-by-subject/{subjectId}
    [HttpGet("students-by-subject/{subjectId}")]
    public async Task<IActionResult> GetStudentsBySubject(string subjectId)
    {
        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        var filterBuilder = Builders<Subject>.Filter;
        var filter = filterBuilder.And(
            filterBuilder.Eq(s => s.Id, subjectId),
            GetTeacherAssignmentFilter(teacherId)
        );

        var subject = await _context.Subjects.Find(filter).FirstOrDefaultAsync();

        if (subject == null)
        {
            return Forbid();
        }

        var students = await _context.Users
            .Find(u => u.Role == Role.Student && u.CourseId == subject.CourseId)
            .ToListAsync();

        return Ok(students);
    }

    // GET: api/teacher/me
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        var teacher = await _context.Users
            .Find(u => u.Id == teacherId && u.Role == Role.Teacher)
            .FirstOrDefaultAsync();

        if (teacher == null) 
        {
            return NotFound(new { message = "Teacher profile not found." });
        }

        var subjects = await _context.Subjects
            .Find(GetTeacherAssignmentFilter(teacherId))
            .ToListAsync();

        var subjectIds = subjects.Select(s => s.Id).ToList();

        var profile = new
        {
            id = teacher.Id,
            name = teacher.Name,
            email = teacher.Email,
            specialties = teacher.Specialties,
            versions = teacher.Versions,
            levels = teacher.Levels,
            subjects = subjectIds
        };

        return Ok(profile);
    }

    // GET: api/teacher/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTeacherByIdRoute(string id)
    {
        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        var targetTeacher = await _context.Users
            .Find(u => u.Id == id && u.Role == Role.Teacher)
            .FirstOrDefaultAsync();

        if (targetTeacher == null)
        {
            return NotFound(new { message = "Teacher not found." });
        }

        var subjects = await _context.Subjects
            .Find(GetTeacherAssignmentFilter(id))
            .ToListAsync();

        var subjectIds = subjects.Select(s => s.Id).ToList();

        var profile = new
        {
            id = targetTeacher.Id,
            name = targetTeacher.Name,
            email = targetTeacher.Email,
            specialties = targetTeacher.Specialties,
            versions = targetTeacher.Versions,
            levels = targetTeacher.Levels,
            subjects = subjectIds
        };

        return Ok(profile);
    }

    // GET: api/teacher/my-courses
    [HttpGet("my-courses")]
    public async Task<IActionResult> GetMyCourses(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        var subjects = await _context.Subjects
            .Find(GetTeacherAssignmentFilter(teacherId))
            .ToListAsync();

        var courseIds = subjects.Select(s => s.CourseId).Distinct().Where(id => id != null).ToList();
        var totalCount = courseIds.Count;

        var courses = await _context.Courses
            .Find(c => c.Id != null && courseIds.Contains(c.Id))
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

    // GET: api/teacher/my-subjects
    [HttpGet("my-subjects")]
    public async Task<IActionResult> GetMySubjects(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        var totalCount = await _context.Subjects.CountDocumentsAsync(GetTeacherAssignmentFilter(teacherId));

        var subjects = await _context.Subjects.Find(GetTeacherAssignmentFilter(teacherId))
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        var courseIds = subjects.Select(s => s.CourseId).Distinct().Where(id => id != null).ToList();
        var courses = await _context.Courses.Find(c => c.Id != null && courseIds.Contains(c.Id)).ToListAsync();
        var courseMap = courses.Where(c => c.Id != null).ToDictionary(c => c.Id!, c => c);

        var data = subjects.Select(s => new
        {
            id = s.Id,
            name = s.Name,
            nameBn = s.NameBn,
            courseId = s.CourseId,
            courseName = courseMap.TryGetValue(s.CourseId, out var mappedCourse) ? mappedCourse.Name : null,
            courseNameBn = courseMap.TryGetValue(s.CourseId, out var mappedCourseBn) ? mappedCourseBn.NameBn : null
        }).ToList();

        var totalPage = (int)Math.Ceiling((double)totalCount / pageSize);

        return Ok(new
        {
            data,
            page,
            totalPage,
            totalCount
        });
    }

    // GET: api/teacher/my-students
    [HttpGet("my-students")]
    public async Task<IActionResult> GetMyStudents(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        var subjects = await _context.Subjects
            .Find(GetTeacherAssignmentFilter(teacherId))
            .ToListAsync();

        var courseIds = subjects.Select(s => s.CourseId).Distinct().Where(id => id != null).ToList();

        var filterBuilder = Builders<User>.Filter;
        var studentFilters = new List<FilterDefinition<User>>
        {
            filterBuilder.Eq(u => u.Role, Role.Student),
            filterBuilder.In(u => u.CourseId, courseIds)
        };

        if (!string.IsNullOrEmpty(search))
        {
            var searchRegex = new BsonRegularExpression(search, "i");
            studentFilters.Add(filterBuilder.Or(
                filterBuilder.Regex(u => u.Name, searchRegex),
                filterBuilder.Regex(u => u.Email, searchRegex)
            ));
        }

        var finalFilter = filterBuilder.And(studentFilters);
        var totalCount = await _context.Users.CountDocumentsAsync(finalFilter);

        var students = await _context.Users.Find(finalFilter)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        var totalPage = (int)Math.Ceiling((double)totalCount / pageSize);

        return Ok(new
        {
            data = students,
            page,
            totalPage,
            totalCount
        });
    }

    // GET: api/teacher/my-colleagues
   // GET: api/teacher/my-colleagues
[HttpGet("my-colleagues")]
public async Task<IActionResult> GetMyColleagues(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
{
    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 10;

    var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

    var currentTeacher = await _context.Users
        .Find(u => u.Id == teacherId && u.Role == Role.Teacher)
        .FirstOrDefaultAsync();

    if (currentTeacher == null) return NotFound(new { message = "Teacher profile not found." });

    // 1. Fetch exact co-teachers who share subject assignments
    var mySubjects = await _context.Subjects
        .Find(GetTeacherAssignmentFilter(teacherId))
        .ToListAsync();

    var coTeacherIds = mySubjects
        .Where(s => s.TeacherIds != null)
        .SelectMany(s => s.TeacherIds)
        .Distinct()
        .Where(id => id != teacherId)
        .ToList();

    var filterBuilder = Builders<User>.Filter;
    var colleagueFilters = new List<FilterDefinition<User>>();

    // Condition A: Teachers who are explicitly assigned to the exact same subjects
    if (coTeacherIds.Count > 0)
    {
        colleagueFilters.Add(filterBuilder.In(u => u.Id, coTeacherIds));
    }

    // Condition B: MUST share a Specialty (Department) AND an Academic Level
    if (currentTeacher.Specialties != null && currentTeacher.Specialties.Count > 0 &&
        currentTeacher.Levels != null && currentTeacher.Levels.Count > 0)
    {
        colleagueFilters.Add(filterBuilder.And(
            filterBuilder.AnyIn(u => u.Specialties, currentTeacher.Specialties),
            filterBuilder.AnyIn(u => u.Levels, currentTeacher.Levels)
        ));
    }

    // Combine criteria using OR (either they are direct co-teachers, or departmental peers)
    FilterDefinition<User> criteriaFilter = filterBuilder.Empty;
    if (colleagueFilters.Count > 0)
    {
        criteriaFilter = filterBuilder.Or(colleagueFilters);
    }

    // Must be a teacher, cannot be themselves, and must match the strict criteria
    var finalFilter = filterBuilder.And(
        filterBuilder.Eq(u => u.Role, Role.Teacher),
        filterBuilder.Ne(u => u.Id, teacherId),
        criteriaFilter
    );

    var totalCount = await _context.Users.CountDocumentsAsync(finalFilter);

    var colleagues = await _context.Users.Find(finalFilter)
        .Skip((page - 1) * pageSize)
        .Limit(pageSize)
        .ToListAsync();

    var totalPage = (int)Math.Ceiling((double)totalCount / pageSize);

    return Ok(new
    {
        data = colleagues,
        page,
        totalPage,
        totalCount
    });
}
}