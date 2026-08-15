using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class SubmitAnswerDto
{
    [Required(ErrorMessage = "Assignment ID is required")]
    public string AssignmentId { get; set; } = string.Empty;

    public string Answer { get; set; } = string.Empty; // Text-based written answer

    public string? AttachmentUrl { get; set; } // URL of the uploaded local file/image (Nullable)
}

public class UpdateSubmissionDto
{
    public string Answer { get; set; } = string.Empty;

    public string? AttachmentUrl { get; set; } // Optional new file update (Nullable)
}

public class GradeSubmissionDto
{
    [Required(ErrorMessage = "Marks are required")]
    public double Marks { get; set; }

    public string Feedback { get; set; } = string.Empty;

    // Helper property to validate maximum marks range
    public double ContextMarks { get; set; }
}