using System;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateAssignmentDto
{
    [Required(ErrorMessage = "Title is required")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Deadline is required")]
    public DateTime Deadline { get; set; }

    [Required(ErrorMessage = "Maximum marks are required")]
    [Range(1, 1000, ErrorMessage = "Marks must be between 1 and 1000")]
    public double MaxMarks { get; set; }

    [Required(ErrorMessage = "Subject ID is required")]
    public string SubjectId { get; set; } = string.Empty;

    public bool IsPublished { get; set; } = false; // Default to draft

    // FIXED: Added to receive the uploaded attachment link during creation
    public string? AttachmentUrl { get; set; } 
}

public class UpdateAssignmentDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? Deadline { get; set; }
    public double? MaxMarks { get; set; }
    public bool? IsPublished { get; set; }

    // FIXED: Added to allow teachers to update or clear the worksheet link during editing
    public string? AttachmentUrl { get; set; }
}