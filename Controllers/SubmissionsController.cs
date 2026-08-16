using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Serilog;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires valid JWT token to access any endpoint
public class SubmissionsController : ControllerBase
{
    private readonly MongoDbContext _context;

    public SubmissionsController(MongoDbContext context)
    {
        _context = context;
    }

    // 1. Submit an Answer (Student Only)
    [HttpPost]
    [Authorize(Roles = Role.Student)]
    public async Task<IActionResult> SubmitAnswer([FromBody] SubmitAnswerDto dto)
    {
        var studentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(studentId)) return Unauthorized();

        // Verify assignment exists and is published
        var assignment = await _context.Assignments.Find(a => a.Id == dto.AssignmentId).FirstOrDefaultAsync();
        if (assignment == null || !assignment.IsPublished)
        {
            return BadRequest(new { message = "Assignment not found or is not published yet." });
        }

        // BUSINESS RULE 1: Prevent submission if the deadline has passed
        if (DateTime.UtcNow > assignment.Deadline)
        {
            Log.Warning("submission-failed-----id:{StudentId}-----assignmentId:{AssignmentId}-----reason:past-deadline", studentId, dto.AssignmentId);
            return BadRequest(new { message = "The deadline for this assignment has passed." });
        }

        // Verify if the student has already submitted an answer for this assignment
        var existingSubmission = await _context.Submissions
            .Find(s => s.AssignmentId == dto.AssignmentId && s.StudentId == studentId)
            .FirstOrDefaultAsync();

        if (existingSubmission != null)
        {
            return BadRequest(new { message = "You have already submitted an answer. Use the PATCH endpoint to update it." });
        }

        var submission = new Submission
        {
            AssignmentId = dto.AssignmentId,
            StudentId = studentId,
            SubmittedAt = DateTime.UtcNow,
            Answer = dto.Answer,
            AttachmentUrl = dto.AttachmentUrl, // Mapped!
            Status = "Submitted"
        };

        await _context.Submissions.InsertOneAsync(submission);

        Log.Information("user-submitted-assignment-----id:{StudentId}-----assignmentId:{AssignmentId}", studentId, dto.AssignmentId);
        return CreatedAtAction(nameof(GetSubmissionById), new { id = submission.Id }, submission);
    }

    // 2. Update a Submission (Student Only - Before Deadline & Not Graded Only)
    [HttpPatch("{id}")]
    [Authorize(Roles = Role.Student)]
    public async Task<IActionResult> UpdateSubmission(string id, [FromBody] UpdateSubmissionDto dto)
    {
        var studentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var submission = await _context.Submissions.Find(s => s.Id == id).FirstOrDefaultAsync();

        if (submission == null) return NotFound();
        if (submission.StudentId != studentId) return Forbid();

        var assignment = await _context.Assignments.Find(a => a.Id == submission.AssignmentId).FirstOrDefaultAsync();
        if (assignment == null) return BadRequest();

        // BUSINESS RULE 2: Prevent update if the deadline has passed
        if (DateTime.UtcNow > assignment.Deadline)
        {
            Log.Warning("submission-update-failed-----id:{StudentId}-----submissionId:{Id}-----reason:past-deadline", studentId, id);
            return BadRequest(new { message = "Cannot update submission. The deadline has passed." });
        }

        // BUSINESS RULE 3: Prevent update if the teacher has already graded it
        if (submission.Status == "Graded")
        {
            return BadRequest(new { message = "Cannot update submission. It has already been graded." });
        }

        var updateBuilder = Builders<Submission>.Update;
        var updates = new List<UpdateDefinition<Submission>>
        {
            updateBuilder.Set(s => s.Answer, dto.Answer),
            updateBuilder.Set(s => s.SubmittedAt, DateTime.UtcNow)
        };

        // Update attachment if a new one is uploaded
        if (!string.IsNullOrEmpty(dto.AttachmentUrl))
        {
            updates.Add(updateBuilder.Set(s => s.AttachmentUrl, dto.AttachmentUrl));
        }

        await _context.Submissions.UpdateOneAsync(s => s.Id == id, updateBuilder.Combine(updates));

        Log.Information("user-updated-submission-----id:{StudentId}-----submissionId:{Id}", studentId, id);
        return Ok(new { message = "Submission updated successfully" });
    }

    // 3. Grade or Change Grade of a Submission (Teacher & Admin)
    [HttpPost("{id}/grade")]
    [Authorize(Roles = "Teacher,Admin")] // Updated to allow both Roles
    public async Task<IActionResult> GradeSubmission(string id, [FromBody] GradeSubmissionDto dto)
    {
        var graderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        if (string.IsNullOrEmpty(graderId)) return Unauthorized();

        var submission = await _context.Submissions.Find(s => s.Id == id).FirstOrDefaultAsync();
        if (submission == null) return NotFound();

        var assignment = await _context.Assignments.Find(a => a.Id == submission.AssignmentId).FirstOrDefaultAsync();
        if (assignment == null) return BadRequest(new { message = "Parent assignment not found." });

        // SECURITY CHECK: 
        // Admins can grade anything. Teachers can only grade their own assignments.
        if (role == Role.Teacher && assignment.TeacherId != graderId)
        {
            return Forbid();
        }

        // Validate Marks range
        if (dto.Marks < 0 || dto.Marks > assignment.MaxMarks)
        {
            return BadRequest(new { message = $"Marks must be between 0 and the assignment maximum of {assignment.MaxMarks}" });
        }

        // Update submission status to Graded and save marks
        var update = Builders<Submission>.Update
            .Set(s => s.Marks, dto.Marks)
            .Set(s => s.Feedback, dto.Feedback)
            .Set(s => s.Status, "Graded");

        await _context.Submissions.UpdateOneAsync(s => s.Id == id, update);

        Log.Information("submission-graded-----id:{Id}-----gradedBy:{GraderId}-----role:{Role}-----marks:{Marks}", id, graderId, role, dto.Marks);
        return Ok(new { message = "Submission graded successfully" });
    }

    // 4. Get Submission by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSubmissionById(string id)
    {
        var submission = await _context.Submissions.Find(s => s.Id == id).FirstOrDefaultAsync();
        if (submission == null) return NotFound();

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        // Students can only view their own submissions
        if (role == Role.Student && submission.StudentId != userId)
        {
            return Forbid();
        }

        // Teachers can only view submissions for assignments they created
        if (role == Role.Teacher)
        {
            var assignment = await _context.Assignments.Find(a => a.Id == submission.AssignmentId).FirstOrDefaultAsync();
            if (assignment == null || assignment.TeacherId != userId)
            {
                return Forbid();
            }
        }

        return Ok(submission);
    }

    // 5. Get Submissions for an Assignment (Teachers & Admins Only)
    [HttpGet("assignment/{assignmentId}")]
    public async Task<IActionResult> GetAssignmentSubmissions(string assignmentId)
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (role == Role.Student) return Forbid();

        if (role == Role.Teacher)
        {
            // Verify teacher created the parent assignment
            var assignment = await _context.Assignments.Find(a => a.Id == assignmentId).FirstOrDefaultAsync();
            if (assignment == null || assignment.TeacherId != userId)
            {
                return Forbid();
            }
        }

        var submissions = await _context.Submissions.Find(s => s.AssignmentId == assignmentId).ToListAsync();
        return Ok(submissions);
    }
}