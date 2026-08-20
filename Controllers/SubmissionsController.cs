using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Serilog;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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

        var assignment = await _context.Assignments.Find(a => a.Id == dto.AssignmentId).FirstOrDefaultAsync();
        if (assignment == null || !assignment.IsPublished)
        {
            return BadRequest(new { message = "Assignment not found or is not published yet." });
        }

        if (DateTime.UtcNow > assignment.Deadline)
        {
            return BadRequest(new { message = "The deadline for this assignment has passed." });
        }

        var existingSubmission = await _context.Submissions
            .Find(s => s.AssignmentId == dto.AssignmentId && s.StudentId == studentId)
            .FirstOrDefaultAsync();

        if (existingSubmission != null)
        {
            return BadRequest(new { message = "You have already submitted an answer." });
        }

        var submission = new Submission
        {
            AssignmentId = dto.AssignmentId,
            StudentId = studentId,
            SubmittedAt = DateTime.UtcNow,
            Answer = dto.Answer,
            AttachmentUrl = dto.AttachmentUrl,
            Status = "Submitted"
        };

        await _context.Submissions.InsertOneAsync(submission);
        return CreatedAtAction(nameof(GetSubmissionById), new { id = submission.Id }, submission);
    }

    // 2. Update a Submission (Student Only - Allows resubmitting rejected work)
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

        if (DateTime.UtcNow > assignment.Deadline)
        {
            return BadRequest(new { message = "Cannot update submission. The deadline has passed." });
        }

        if (submission.Status == "Graded")
        {
            return BadRequest(new { message = "Cannot update submission. It has already been graded." });
        }

        var updateBuilder = Builders<Submission>.Update;
        var updates = new List<UpdateDefinition<Submission>>
        {
            updateBuilder.Set(s => s.Answer, dto.Answer),
            updateBuilder.Set(s => s.SubmittedAt, DateTime.UtcNow),
            updateBuilder.Set(s => s.Status, "Submitted"),
            updateBuilder.Set(s => s.Marks, null)
        };

        if (!string.IsNullOrEmpty(dto.AttachmentUrl))
        {
            updates.Add(updateBuilder.Set(s => s.AttachmentUrl, dto.AttachmentUrl));
        }

        await _context.Submissions.UpdateOneAsync(s => s.Id == id, updateBuilder.Combine(updates));
        return Ok(new { message = "Submission updated and resubmitted successfully" });
    }

    // 3. Grade or Reject a Submission (Teacher & Admin Only)
    [HttpPost("{id}/grade")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> GradeSubmission(string id, [FromBody] GradeSubmissionDto dto)
    {
        var graderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        var submission = await _context.Submissions.Find(s => s.Id == id).FirstOrDefaultAsync();
        if (submission == null) return NotFound();

        var assignment = await _context.Assignments.Find(a => a.Id == submission.AssignmentId).FirstOrDefaultAsync();
        if (assignment == null) return BadRequest(new { message = "Parent assignment not found." });

        if (role == Role.Teacher && assignment.TeacherId != graderId)
        {
            return Forbid();
        }

        var targetStatus = string.Equals(dto.Status, "Rejected", StringComparison.OrdinalIgnoreCase) 
            ? "Rejected" 
            : "Graded";

        if (targetStatus == "Graded" && (dto.Marks < 0 || dto.Marks > assignment.MaxMarks))
        {
            return BadRequest(new { message = $"Marks must be between 0 and {assignment.MaxMarks}" });
        }

        var update = Builders<Submission>.Update
            .Set(s => s.Marks, targetStatus == "Rejected" ? null : dto.Marks)
            .Set(s => s.Feedback, dto.Feedback)
            .Set(s => s.Status, targetStatus);

        await _context.Submissions.UpdateOneAsync(s => s.Id == id, update);
        return Ok(new { message = $"Submission finalized as {targetStatus} successfully" });
    }

    // 4. Get Submission by ID (Access restricted to Owner, Teacher, and Admins)
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSubmissionById(string id)
    {
        var submission = await _context.Submissions.Find(s => s.Id == id).FirstOrDefaultAsync();
        if (submission == null) return NotFound();

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (role == Role.Student && submission.StudentId != userId) return Forbid();

        if (role == Role.Teacher)
        {
            var assignment = await _context.Assignments.Find(a => a.Id == submission.AssignmentId).FirstOrDefaultAsync();
            if (assignment == null || assignment.TeacherId != userId) return Forbid();
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