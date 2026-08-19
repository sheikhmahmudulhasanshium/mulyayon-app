using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Role.Admin)] // Restricted to Admin role only
public class AdminController : ControllerBase
{
    private readonly MongoDbContext _context;

    public AdminController(MongoDbContext context)
    {
        _context = context;
    }

    // ==========================================
    // 1. COURSE MANAGEMENT
    // ==========================================

    [HttpPost("courses")]
    public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto dto)
    {
        var duplicateExists = await _context.Courses
            .Find(c => c.Name.ToLower() == dto.Name.ToLower())
            .AnyAsync();

        if (duplicateExists)
        {
            return BadRequest(new { message = $"A Course/Class named '{dto.Name}' already exists." });
        }

        // Retrieve the highest Order value currently in the collection
        var highestOrderCourse = await _context.Courses
            .Find(Builders<Course>.Filter.Empty)
            .SortByDescending(c => c.Order)
            .FirstOrDefaultAsync();

        // If courses exist, increment the highest order by 1, otherwise start at 1
        int nextOrder = highestOrderCourse != null ? highestOrderCourse.Order + 1 : 1;

        var course = new Course 
        { 
            Name = dto.Name,
            Order = nextOrder
        };
        
        await _context.Courses.InsertOneAsync(course);

        Log.Information("course-added-----id:{Id}-----name:{Name}-----order:{Order}", course.Id, course.Name, course.Order);
        return CreatedAtAction(nameof(GetCourses), new { id = course.Id }, course);
    }

    [HttpGet("courses")]
    public async Task<IActionResult> GetCourses()
    {
        // Safe: Retrieve courses and sort them in-memory to handle legacy documents without 'Order'
        var courses = await _context.Courses.Find(_ => true).ToListAsync();
        var sortedCourses = courses.OrderBy(c => c.Order).ToList();
        return Ok(sortedCourses);
    }

    [HttpPatch("courses/{id}")]
    public async Task<IActionResult> UpdateCourse(string id, [FromBody] UpdateCourseDto dto)
    {
        var course = await _context.Courses.Find(c => c.Id == id).FirstOrDefaultAsync();
        if (course == null)
        {
            return NotFound(new { message = "Course not found" });
        }

        var duplicateExists = await _context.Courses
            .Find(c => c.Name.ToLower() == dto.Name.ToLower() && c.Id != id)
            .AnyAsync();

        if (duplicateExists)
        {
            return BadRequest(new { message = $"A Course/Class named '{dto.Name}' already exists." });
        }

        var update = Builders<Course>.Update.Set(c => c.Name, dto.Name);
        await _context.Courses.UpdateOneAsync(c => c.Id == id, update);

        Log.Information("course-updated-----id:{Id}-----newName:{Name}", id, dto.Name);
        return Ok(new { message = "Course updated successfully" });
    }

    [HttpDelete("courses/{id}")]
    public async Task<IActionResult> DeleteCourse(string id)
    {
        var result = await _context.Courses.DeleteOneAsync(c => c.Id == id);
        if (result.DeletedCount == 0)
        {
            return NotFound(new { message = "Course not found" });
        }

        await _context.Subjects.DeleteManyAsync(s => s.CourseId == id);

        Log.Information("course-removed-----id:{Id}", id);
        return Ok(new { message = "Course and linked subjects deleted successfully" });
    }

    // ==========================================
    // 2. SUBJECT MANAGEMENT
    // ==========================================

    [HttpPost("subjects")]
    public async Task<IActionResult> CreateSubject([FromBody] CreateSubjectDto dto)
    {
        var course = await _context.Courses.Find(c => c.Id == dto.CourseId).FirstOrDefaultAsync();
        if (course == null)
        {
            return BadRequest(new { message = "Target Course not found" });
        }

        var duplicateExists = await _context.Subjects
            .Find(s => s.Name.ToLower() == dto.Name.ToLower() && s.CourseId == dto.CourseId)
            .AnyAsync();

        if (duplicateExists)
        {
            return BadRequest(new { message = $"A Subject named '{dto.Name}' already exists inside '{course.Name}'." });
        }

        var subject = new Subject { Name = dto.Name, CourseId = dto.CourseId };
        await _context.Subjects.InsertOneAsync(subject);

        Log.Information("subject-added-----id:{Id}-----name:{Name}-----courseId:{CourseId}", subject.Id, subject.Name, subject.CourseId);
        return CreatedAtAction(nameof(GetSubjects), new { id = subject.Id }, subject);
    }

    [HttpGet("subjects")]
    public async Task<IActionResult> GetSubjects()
    {
        var subjects = await _context.Subjects.Find(_ => true).ToListAsync();
        return Ok(subjects);
    }

    [HttpPatch("subjects/{id}")]
    public async Task<IActionResult> UpdateSubject(string id, [FromBody] UpdateSubjectDto dto)
    {
        var subject = await _context.Subjects.Find(s => s.Id == id).FirstOrDefaultAsync();
        if (subject == null)
        {
            return NotFound(new { message = "Subject not found" });
        }

        var updateBuilder = Builders<Subject>.Update;
        var updates = new List<UpdateDefinition<Subject>>();

        if (!string.IsNullOrEmpty(dto.CourseId))
        {
            var courseExists = await _context.Courses.Find(c => c.Id == dto.CourseId).AnyAsync();
            if (!courseExists)
            {
                return BadRequest(new { message = "Target Course not found" });
            }
            updates.Add(updateBuilder.Set(s => s.CourseId, dto.CourseId));
        }

        if (!string.IsNullOrEmpty(dto.Name))
        {
            var targetCourseId = dto.CourseId ?? subject.CourseId;
            var duplicateExists = await _context.Subjects
                .Find(s => s.Name.ToLower() == dto.Name.ToLower() && s.CourseId == targetCourseId && s.Id != id)
                .AnyAsync();

            if (duplicateExists)
            {
                return BadRequest(new { message = $"A Subject named '{dto.Name}' already exists inside target course." });
            }
            updates.Add(updateBuilder.Set(s => s.Name, dto.Name));
        }

        if (updates.Count > 0)
        {
            await _context.Subjects.UpdateOneAsync(s => s.Id == id, updateBuilder.Combine(updates));
            Log.Information("subject-updated-----id:{Id}", id);
        }

        return Ok(new { message = "Subject updated successfully" });
    }

    [HttpDelete("subjects/{id}")]
    public async Task<IActionResult> DeleteSubject(string id)
    {
        var result = await _context.Subjects.DeleteOneAsync(s => s.Id == id);
        if (result.DeletedCount == 0)
        {
            return NotFound(new { message = "Subject not found" });
        }

        Log.Information("subject-removed-----id:{Id}", id);
        return Ok(new { message = "Subject deleted successfully" });
    }

    // ==========================================
    // 3. USER MANAGEMENT (Admin, Teacher, Student)
    // ==========================================

    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        if (dto.Role != Role.Admin && dto.Role != Role.Teacher && dto.Role != Role.Student)
        {
            return BadRequest(new { message = "Invalid role specified" });
        }

        var existingUser = await _context.Users.Find(u => u.Email == dto.Email).FirstOrDefaultAsync();
        if (existingUser != null)
        {
            return BadRequest(new { message = "Email is already registered" });
        }

        if (dto.Role == Role.Student)
        {
            if (string.IsNullOrEmpty(dto.CourseId))
            {
                return BadRequest(new { message = "Students must be assigned to a Course" });
            }
            var course = await _context.Courses.Find(c => c.Id == dto.CourseId).FirstOrDefaultAsync();
            if (course == null)
            {
                return BadRequest(new { message = "Assigned Course not found" });
            }
        }

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role,
            CourseId = dto.Role == Role.Student ? dto.CourseId : null
        };

        await _context.Users.InsertOneAsync(user);

        Log.Information("user-added-----id:{Id}-----type:{Role}", user.Id, user.Role);
        return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, new { id = user.Id, user.Name, user.Email, user.Role });
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users.Find(_ => true).ToListAsync();
        return Ok(users);
    }

    [HttpPatch("users/{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
    {
        var user = await _context.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        var updateBuilder = Builders<User>.Update;
        var updates = new List<UpdateDefinition<User>>();

        if (!string.IsNullOrEmpty(dto.Name))
        {
            updates.Add(updateBuilder.Set(u => u.Name, dto.Name));
        }

        if (!string.IsNullOrEmpty(dto.Email))
        {
            var emailExists = await _context.Users.Find(u => u.Email == dto.Email && u.Id != id).AnyAsync();
            if (emailExists)
            {
                return BadRequest(new { message = "Email is already registered by another user" });
            }
            updates.Add(updateBuilder.Set(u => u.Email, dto.Email));
        }

        if (!string.IsNullOrEmpty(dto.CourseId))
        {
            if (user.Role != Role.Student)
            {
                return BadRequest(new { message = "Only Student users can be assigned to a Course" });
            }
            var courseExists = await _context.Courses.Find(c => c.Id == dto.CourseId).AnyAsync();
            if (!courseExists)
            {
                return BadRequest(new { message = "Target Course not found" });
            }
            updates.Add(updateBuilder.Set(u => u.CourseId, dto.CourseId));
        }

        if (updates.Count > 0)
        {
            await _context.Users.UpdateOneAsync(u => u.Id == id, updateBuilder.Combine(updates));
            Log.Information("user-updated-----id:{Id}-----type:{Role}", id, user.Role);
        }

        return Ok(new { message = "User updated successfully" });
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var result = await _context.Users.DeleteOneAsync(u => u.Id == id);
        if (result.DeletedCount == 0)
        {
            return NotFound(new { message = "User not found" });
        }

        Log.Information("user-removed-----id:{Id}", id);
        return Ok(new { message = "User deleted successfully" });
    }

    // ==========================================
    // 4. TEACHER ALLOCATION & AVAILABILITY
    // ==========================================

    [HttpPost("assign-teacher")]
    public async Task<IActionResult> AssignTeacher([FromBody] AssignTeacherDto dto)
    {
        var subject = await _context.Subjects.Find(s => s.Id == dto.SubjectId).FirstOrDefaultAsync();
        if (subject == null)
        {
            return BadRequest(new { message = "Subject not found" });
        }

        var teacher = await _context.Users.Find(u => u.Id == dto.TeacherId && u.Role == Role.Teacher).FirstOrDefaultAsync();
        if (teacher == null)
        {
            return BadRequest(new { message = "Teacher user not found or is not a Teacher" });
        }

        var filter = Builders<Subject>.Filter.Eq(s => s.Id, dto.SubjectId);
        var update = Builders<Subject>.Update.AddToSet(s => s.TeacherIds, dto.TeacherId);
        await _context.Subjects.UpdateOneAsync(filter, update);

        Log.Information("teacher-assigned-to-subject-----teacherId:{TeacherId}-----subjectId:{SubjectId}", dto.TeacherId, dto.SubjectId);
        return Ok(new { message = "Teacher assigned to subject successfully" });
    }

    [HttpPost("unassign-teacher")]
    public async Task<IActionResult> UnassignTeacher([FromBody] AssignTeacherDto dto)
    {
        var subject = await _context.Subjects.Find(s => s.Id == dto.SubjectId).FirstOrDefaultAsync();
        if (subject == null)
        {
            return BadRequest(new { message = "Subject not found" });
        }

        var filter = Builders<Subject>.Filter.Eq(s => s.Id, dto.SubjectId);
        var update = Builders<Subject>.Update.Pull(s => s.TeacherIds, dto.TeacherId);
        await _context.Subjects.UpdateOneAsync(filter, update);

        Log.Information("teacher-unassigned-from-subject-----teacherId:{TeacherId}-----subjectId:{SubjectId}", dto.TeacherId, dto.SubjectId);
        return Ok(new { message = "Teacher unassigned from subject successfully" });
    }

    [HttpGet("teachers/unassigned")]
    public async Task<IActionResult> GetUnassignedTeachers()
    {
        var subjects = await _context.Subjects.Find(_ => true).ToListAsync();
        var assignedTeacherIds = subjects
            .Where(s => s.TeacherIds != null)
            .SelectMany(s => s.TeacherIds)
            .Distinct()
            .ToList();

        var unassignedTeachers = await _context.Users
            .Find(u => u.Role == Role.Teacher && u.Id != null && !assignedTeacherIds.Contains(u.Id))
            .ToListAsync();

        return Ok(new
        {
            count = unassignedTeachers.Count,
            teachers = unassignedTeachers
        });
    }

    [HttpGet("teachers/search")]
    public async Task<IActionResult> SearchTeachers(
        [FromQuery] string? level,
        [FromQuery] string? specialty,
        [FromQuery] string? version,
        [FromQuery] bool onlyUnassigned = false)
    {
        var filterBuilder = Builders<User>.Filter;
        var filters = new List<FilterDefinition<User>>
        {
            filterBuilder.Eq(u => u.Role, Role.Teacher)
        };

        if (!string.IsNullOrEmpty(level))
        {
            filters.Add(filterBuilder.AnyEq(u => u.Levels, level));
        }

        if (!string.IsNullOrEmpty(specialty))
        {
            filters.Add(filterBuilder.AnyEq(u => u.Specialties, specialty));
        }

        if (!string.IsNullOrEmpty(version))
        {
            filters.Add(filterBuilder.AnyEq(u => u.Versions, version));
        }

        var combinedFilter = filterBuilder.And(filters);
        var teachers = await _context.Users.Find(combinedFilter).ToListAsync();

        if (onlyUnassigned)
        {
            var subjects = await _context.Subjects.Find(_ => true).ToListAsync();
            var assignedIds = subjects
                .Where(s => s.TeacherIds != null)
                .SelectMany(s => s.TeacherIds)
                .Distinct()
                .ToList();

            teachers = teachers.Where(t => t.Id != null && !assignedIds.Contains(t.Id)).ToList();
        }

        return Ok(teachers);
    }

    // ==========================================
    // 5. DATABASE METRICS & STATS
    // ==========================================

    [HttpGet("stats")]
    public async Task<IActionResult> GetDbStatistics()
    {
        // Safe: Retrieve courses and sort in-memory to prevent legacy DB null-ordering exceptions
        var coursesTask = _context.Courses.Find(Builders<Course>.Filter.Empty).ToListAsync();
        var subjectsTask = _context.Subjects.Find(Builders<Subject>.Filter.Empty).ToListAsync();
        var usersTask = _context.Users.Find(Builders<User>.Filter.Empty).ToListAsync();

        await Task.WhenAll(coursesTask, subjectsTask, usersTask);

        var allCourses = (await coursesTask).OrderBy(c => c.Order).ToList();
        var allSubjects = await subjectsTask;
        var allUsers = await usersTask;

        var totalVersions = allCourses.Select(c => c.Version).Distinct().Count();
        var totalCourses = allCourses.Count;
        var totalSubjects = allSubjects.Count;

        // Process Teacher stats
        var teachers = allUsers.Where(u => u.Role == Role.Teacher).ToList();
        var totalTeachers = teachers.Count;

        var assignedTeacherIds = allSubjects
            .Where(s => s.TeacherIds != null)
            .SelectMany(s => s.TeacherIds)
            .Distinct()
            .ToList();

        var unassignedTeachersCount = teachers.Count(t => t.Id != null && !assignedTeacherIds.Contains(t.Id));

        var teacherLevels = new Dictionary<string, int>
        {
            { "Primary", teachers.Count(t => t.Levels != null && t.Levels.Contains("Primary")) },
            { "Secondary", teachers.Count(t => t.Levels != null && t.Levels.Contains("Secondary")) },
            { "Higher Secondary", teachers.Count(t => t.Levels != null && t.Levels.Contains("Higher Secondary")) }
        };

        // Process Student stats
        var students = allUsers.Where(u => u.Role == Role.Student).ToList();
        var totalStudents = students.Count;

        var unassignedStudentsCount = students.Count(s => string.IsNullOrEmpty(s.CourseId));

        var courseMap = allCourses.ToDictionary(c => c.Id!, c => c);

        var studentsByVersionAndClass = new Dictionary<string, Dictionary<string, int>>
        {
            { "BV", new Dictionary<string, int>() },
            { "EV", new Dictionary<string, int>() }
        };

        // Pre-populate keys in exact academic order to guarantee correct JSON key sorting
        foreach (var course in allCourses)
        {
            if (string.IsNullOrEmpty(course.Name)) continue;

            var versionKey = course.Version == "Bangla" ? "BV" : "EV";
            var cleanCourseName = course.Name.Replace(" (BV)", "").Replace(" (EV)", "").Trim();

            var targetDictionary = studentsByVersionAndClass[versionKey];
            if (!targetDictionary.ContainsKey(cleanCourseName))
            {
                targetDictionary[cleanCourseName] = 0;
            }
        }

        // Populate student counts defensively
        foreach (var student in students)
        {
            if (string.IsNullOrEmpty(student.CourseId)) continue;

            if (courseMap.TryGetValue(student.CourseId, out var course))
            {
                if (string.IsNullOrEmpty(course.Name)) continue;

                var versionKey = course.Version == "Bangla" ? "BV" : "EV";
                var cleanCourseName = course.Name.Replace(" (BV)", "").Replace(" (EV)", "").Trim();

                var targetDictionary = studentsByVersionAndClass[versionKey];
                if (!targetDictionary.ContainsKey(cleanCourseName))
                {
                    targetDictionary[cleanCourseName] = 0;
                }
                targetDictionary[cleanCourseName]++;
            }
        }

        var statistics = new
        {
            totalVersions,
            totalSubjects,
            totalCourses,
            teachers = new
            {
                total = totalTeachers,
                assigned = totalTeachers - unassignedTeachersCount,
                unassigned = unassignedTeachersCount,
                byLevel = teacherLevels
            },
            students = new
            {
                total = totalStudents,
                assigned = totalStudents - unassignedStudentsCount,
                unassigned = unassignedStudentsCount,
                byVersion = studentsByVersionAndClass
            }
        };

        return Ok(statistics);
    }
}