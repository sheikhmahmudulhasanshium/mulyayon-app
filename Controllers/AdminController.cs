using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Serilog;

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
        // Check for duplicate course name (case-insensitive)
        var duplicateExists = await _context.Courses
            .Find(c => c.Name.ToLower() == dto.Name.ToLower())
            .AnyAsync();

        if (duplicateExists)
        {
            return BadRequest(new { message = $"A Course/Class named '{dto.Name}' already exists." });
        }

        var course = new Course { Name = dto.Name };
        await _context.Courses.InsertOneAsync(course);

        Log.Information("course-added-----id:{Id}-----name:{Name}", course.Id, course.Name);
        return CreatedAtAction(nameof(GetCourses), new { id = course.Id }, course);
    }

    [HttpGet("courses")]
    public async Task<IActionResult> GetCourses()
    {
        var courses = await _context.Courses.Find(_ => true).ToListAsync();
        return Ok(courses);
    }
[HttpPatch("courses/{id}")]
    public async Task<IActionResult> UpdateCourse(string id, [FromBody] UpdateCourseDto dto)
    {
        // 1. Verify Course exists
        var course = await _context.Courses.Find(c => c.Id == id).FirstOrDefaultAsync();
        if (course == null)
        {
            return NotFound(new { message = "Course not found" });
        }

        // 2. Prevent duplicate course names
        var duplicateExists = await _context.Courses
            .Find(c => c.Name.ToLower() == dto.Name.ToLower() && c.Id != id)
            .AnyAsync();

        if (duplicateExists)
        {
            return BadRequest(new { message = $"A Course/Class named '{dto.Name}' already exists." });
        }

        // 3. Update
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

        // Clean up linked subjects when a course is deleted
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

        // Check for duplicate subject name in this specific course
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

        // Update CourseId if provided
        if (!string.IsNullOrEmpty(dto.CourseId))
        {
            var courseExists = await _context.Courses.Find(c => c.Id == dto.CourseId).AnyAsync();
            if (!courseExists)
            {
                return BadRequest(new { message = "Target Course not found" });
            }
            updates.Add(updateBuilder.Set(s => s.CourseId, dto.CourseId));
        }

        // Update Name if provided
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
    // 4. TEACHER ASSIGNMENT
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
        var update = Builders<Subject>.Update.Set(s => s.TeacherId, dto.TeacherId);
        await _context.Subjects.UpdateOneAsync(filter, update);

        Log.Information("teacher-assigned-to-subject-----teacherId:{TeacherId}-----subjectId:{SubjectId}", dto.TeacherId, dto.SubjectId);
        return Ok(new { message = "Teacher assigned to subject successfully" });
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

        // Update Name if provided
        if (!string.IsNullOrEmpty(dto.Name))
        {
            updates.Add(updateBuilder.Set(u => u.Name, dto.Name));
        }

        // Update Email if provided
        if (!string.IsNullOrEmpty(dto.Email))
        {
            var emailExists = await _context.Users.Find(u => u.Email == dto.Email && u.Id != id).AnyAsync();
            if (emailExists)
            {
                return BadRequest(new { message = "Email is already registered by another user" });
            }
            updates.Add(updateBuilder.Set(u => u.Email, dto.Email));
        }

        // Update CourseId if Student
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
}