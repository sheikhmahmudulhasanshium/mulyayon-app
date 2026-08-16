using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Role.Teacher)] // Restricted strictly to Teachers
public class TeacherController : ControllerBase
{
    private readonly MongoDbContext _context;

    public TeacherController(MongoDbContext context)
    {
        _context = context;
    }

    // GET: api/teacher/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetTeacherStats()
    {
        // 1. Get Teacher ID from JWT claims
        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        // 2. Find all Subjects taught by this Teacher
        var subjects = await _context.Subjects
            .Find(s => s.TeacherIds != null && s.TeacherIds.Contains(teacherId))
            .ToListAsync();

        var courseIds = subjects.Select(s => s.CourseId).Distinct().ToList();

        // 3. Count unique classes (courses) and active students in those classes
        var totalClassesToTake = courseIds.Count;
        var totalStudentsInClasses = await _context.Users
            .CountDocumentsAsync(u => u.Role == Role.Student && u.CourseId != null && courseIds.Contains(u.CourseId));

        // 4. Fetch all Assignments created by this Teacher
        var assignments = await _context.Assignments.Find(a => a.TeacherId == teacherId).ToListAsync();
        var assignmentIds = assignments.Select(a => a.Id).ToList();

        // 5. Fetch all Submissions for those assignments
        var submissions = await _context.Submissions
            .Find(s => s.AssignmentId != null && assignmentIds.Contains(s.AssignmentId))
            .ToListAsync();

        // Calculate Submissions pipeline metrics (Warning resolved: IsGraded replaced with Status check)
        var received = submissions.Count;
        var pending = submissions.Count(s => s.Status == "Pending");
        var rejected = submissions.Count(s => s.Status == "Rejected");

        // 6. Calculate Class Performance (Grades distribution based on graded submissions)
        var grades = new Dictionary<string, int>
        {
            { "A+", 0 }, { "A", 0 }, { "A-", 0 }, { "B", 0 }, { "C", 0 }, { "D", 0 }, { "F", 0 }
        };

        // Warning resolved: IsGraded replaced with Status == "Graded" check
        foreach (var sub in submissions.Where(s => s.Status == "Graded"))
        {
            var assignment = assignments.FirstOrDefault(a => a.Id == sub.AssignmentId);
            if (assignment == null || assignment.MaxMarks <= 0) continue;

            // Calculate percentage score
            if (!sub.Marks.HasValue) continue; // Skip if marks are somehow null
            double percentage = (sub.Marks.Value / assignment.MaxMarks) * 100;

            // National Grading Standard mapping
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
        // 1. Get Teacher ID from JWT claims
        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        // 2. Security Check: Verify the teacher teaches at least one subject in this course
        var teachesThisCourse = await _context.Subjects
            .Find(s => s.CourseId == courseId && s.TeacherIds != null && s.TeacherIds.Contains(teacherId))
            .AnyAsync();

        if (!teachesThisCourse)
        {
            return Forbid(); // Deny access if they don't teach this class
        }

        // 3. Retrieve all students enrolled in this course
        var students = await _context.Users
            .Find(u => u.Role == Role.Student && u.CourseId == courseId)
            .ToListAsync();

        // Returns students (User model automatically hides PasswordHash due to [JsonIgnore])
        return Ok(students);
    }// GET: api/teacher/students/{studentId}
    [HttpGet("students/{studentId}")]
    public async Task<IActionResult> GetStudentById(string studentId)
    {
        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        // 1. Fetch the target student
        var student = await _context.Users
            .Find(u => u.Id == studentId && u.Role == Role.Student)
            .FirstOrDefaultAsync();

        if (student == null) return NotFound(new { message = "Student not found" });

        // 2. Security Check: Verify the teacher teaches at least one subject in the student's course
        var teachesStudent = await _context.Subjects
            .Find(s => s.CourseId == student.CourseId && s.TeacherIds != null && s.TeacherIds.Contains(teacherId))
            .AnyAsync();

        if (!teachesStudent)
        {
            return Forbid(); // Prevent teachers from viewing students outside their classes
        }

        return Ok(student);
    }
    // GET: api/teacher/students-by-subject/{subjectId}
    [HttpGet("students-by-subject/{subjectId}")]
    public async Task<IActionResult> GetStudentsBySubject(string subjectId)
    {
        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        // 1. Verify the subject exists and that this teacher teaches it
        var subject = await _context.Subjects
            .Find(s => s.Id == subjectId && s.TeacherIds != null && s.TeacherIds.Contains(teacherId))
            .FirstOrDefaultAsync();

        if (subject == null)
        {
            return Forbid(); // Deny access if they do not teach this subject
        }

        // 2. Fetch all students enrolled in the parent course
        var students = await _context.Users
            .Find(u => u.Role == Role.Student && u.CourseId == subject.CourseId)
            .ToListAsync();

        return Ok(students);
    }
}