using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson; // Added to resolve CS0103
using MongoDB.Driver;
using Serilog;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires users to be logged in (JWT validated)
public class AssignmentsController : ControllerBase
{
    private readonly MongoDbContext _context;

    public AssignmentsController(MongoDbContext context)
    {
        _context = context;
    }

    // 1. Create an Assignment (Teacher Only - Restricting strictly to subjects they teach)
    [HttpPost]
    [Authorize(Roles = Role.Teacher)]
    public async Task<IActionResult> CreateAssignment([FromBody] CreateAssignmentDto dto)
    {
        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(teacherId)) return Unauthorized();

        // Verify Subject exists
        var subject = await _context.Subjects.Find(s => s.Id == dto.SubjectId).FirstOrDefaultAsync();
        if (subject == null)
        {
            return BadRequest(new { message = "Subject not found" });
        }

        // SECURITY CHECK: Ensure the teacher is actually assigned to teach this subject
        var hasValidObjectId = ObjectId.TryParse(teacherId, out var objId);
        var subjectFilter = Builders<Subject>.Filter.And(
            Builders<Subject>.Filter.Eq(s => s.Id, dto.SubjectId),
            Builders<Subject>.Filter.Or(
                Builders<Subject>.Filter.AnyEq("teacherIds", teacherId),
                Builders<Subject>.Filter.AnyEq("teacherIds", hasValidObjectId ? objId : ObjectId.Empty)
            )
        );

        var isTeacherAssigned = await _context.Subjects.Find(subjectFilter).AnyAsync();
        if (!isTeacherAssigned)
        {
            return Forbid(); // Blocks teachers from injecting assignments into other departments
        }

        var assignment = new Assignment
        {
            Title = dto.Title,
            Description = dto.Description,
            Deadline = dto.Deadline.ToUniversalTime(), // Store in UTC
            MaxMarks = dto.MaxMarks,
            IsPublished = dto.IsPublished,
            SubjectId = dto.SubjectId,
            TeacherId = teacherId
        };

        await _context.Assignments.InsertOneAsync(assignment);

        Log.Information("assignment-added-----id:{Id}-----title:{Title}-----teacherId:{TeacherId}", assignment.Id, assignment.Title, teacherId);
        return CreatedAtAction(nameof(GetAssignmentById), new { id = assignment.Id }, assignment);
    }

    // 2. Get All Assignments (With Role-Based Filtering)
    [HttpGet]
    public async Task<IActionResult> GetAssignments()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (role == Role.Student)
        {
            // Students can only see published assignments belonging to their Course/Class
            var student = await _context.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (student == null || string.IsNullOrEmpty(student.CourseId)) return Forbid();

            // Find all subjects belonging to the student's course
            var subjectIds = await _context.Subjects
                .Find(s => s.CourseId == student.CourseId)
                .Project(s => s.Id)
                .ToListAsync();

            var assignments = await _context.Assignments
                .Find(a => a.IsPublished && subjectIds.Contains(a.SubjectId))
                .ToListAsync();

            return Ok(assignments);
        }

        if (role == Role.Teacher)
        {
            // Teachers see all assignments they created (both drafts and published)
            var assignments = await _context.Assignments.Find(a => a.TeacherId == userId).ToListAsync();
            return Ok(assignments);
        }

        if (role == Role.Admin)
        {
            // Admins can see absolutely all assignments
            var assignments = await _context.Assignments.Find(_ => true).ToListAsync();
            return Ok(assignments);
        }

        return Forbid();
    }

    // 3. Get Assignment by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAssignmentById(string id)
    {
        var assignment = await _context.Assignments.Find(a => a.Id == id).FirstOrDefaultAsync();
        if (assignment == null) return NotFound();

        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        
        // Prevent Students from accessing draft assignments directly via URL
        if (role == Role.Student && !assignment.IsPublished)
        {
            return Forbid();
        }

        return Ok(assignment);
    }

    // 4. Update an Assignment (Teacher Only)
    [HttpPatch("{id}")]
    [Authorize(Roles = Role.Teacher)]
    public async Task<IActionResult> UpdateAssignment(string id, [FromBody] UpdateAssignmentDto dto)
    {
        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var assignment = await _context.Assignments.Find(a => a.Id == id).FirstOrDefaultAsync();
        
        if (assignment == null) return NotFound();
        
        // Ensure a Teacher can only edit their own assignments
        if (assignment.TeacherId != teacherId) return Forbid();

        var updateBuilder = Builders<Assignment>.Update;
        var updates = new List<UpdateDefinition<Assignment>>();

        if (!string.IsNullOrEmpty(dto.Title)) updates.Add(updateBuilder.Set(a => a.Title, dto.Title));
        if (!string.IsNullOrEmpty(dto.Description)) updates.Add(updateBuilder.Set(a => a.Description, dto.Description));
        if (dto.MaxMarks.HasValue) updates.Add(updateBuilder.Set(a => a.MaxMarks, dto.MaxMarks.Value));
        if (dto.IsPublished.HasValue) updates.Add(updateBuilder.Set(a => a.IsPublished, dto.IsPublished.Value));
        if (dto.Deadline.HasValue) updates.Add(updateBuilder.Set(a => a.Deadline, dto.Deadline.Value.ToUniversalTime()));

        if (updates.Count > 0)
        {
            await _context.Assignments.UpdateOneAsync(a => a.Id == id, updateBuilder.Combine(updates));
            Log.Information("assignment-updated-----id:{Id}-----teacherId:{TeacherId}", id, teacherId);
        }

        return Ok(new { message = "Assignment updated successfully" });
    }

    // 5. Delete an Assignment (Teacher Only)
    [HttpDelete("{id}")]
    [Authorize(Roles = Role.Teacher)]
    public async Task<IActionResult> DeleteAssignment(string id)
    {
        var teacherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var assignment = await _context.Assignments.Find(a => a.Id == id).FirstOrDefaultAsync();
        
        if (assignment == null) return NotFound();
        if (assignment.TeacherId != teacherId) return Forbid();

        await _context.Assignments.DeleteOneAsync(a => a.Id == id);
        
        // Clean up linked submissions when an assignment is deleted
        await _context.Submissions.DeleteManyAsync(s => s.AssignmentId == id);

        Log.Information("assignment-removed-----id:{Id}-----teacherId:{TeacherId}", id, teacherId);
        return Ok(new { message = "Assignment and linked submissions deleted successfully" });
    }
}