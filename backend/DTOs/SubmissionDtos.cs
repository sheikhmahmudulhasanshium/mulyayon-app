using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class SubmitAnswerDto
{
    [Required(ErrorMessage = "Assignment ID is required")]
    public string AssignmentId { get; set; } = string.Empty;

    public string Answer { get; set; } = string.Empty;

    public string? AttachmentUrl { get; set; }
}

public class UpdateSubmissionDto
{
    public string Answer { get; set; } = string.Empty;

    public string? AttachmentUrl { get; set; }
}

public class GradeSubmissionDto
{
    [Required(ErrorMessage = "Marks are required")]
    public double Marks { get; set; }

    public string Feedback { get; set; } = string.Empty;

    public double ContextMarks { get; set; }

    public string? Status { get; set; } = "Graded"; 
}