using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateCourseDto
{
    [Required(ErrorMessage = "Course name is required")]
    public string Name { get; set; } = string.Empty;
}

public class CreateSubjectDto
{
    [Required(ErrorMessage = "Subject name is required")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Course ID is required")]
    public string CourseId { get; set; } = string.Empty;
}

public class AssignTeacherDto
{
    [Required(ErrorMessage = "Subject ID is required")]
    public string SubjectId { get; set; } = string.Empty;

    [Required(ErrorMessage = "Teacher ID is required")]
    public string TeacherId { get; set; } = string.Empty;
}

public class CreateUserDto
{
    [Required(ErrorMessage = "Name is required")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Role is required")]
    public string Role { get; set; } = string.Empty; // "Admin", "Teacher", "Student"

    public string? CourseId { get; set; } // Nullable: Only required for Students
}
public class UpdateCourseDto
{
    [Required(ErrorMessage = "Course name is required")]
    public string Name { get; set; } = string.Empty;
}

public class UpdateSubjectDto
{
    public string? Name { get; set; } // Optional
    public string? CourseId { get; set; } // Optional
}

public class UpdateUserDto
{
    public string? Name { get; set; } // Optional
    
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string? Email { get; set; } // Optional
    
    public string? CourseId { get; set; } // Optional (Students only)
}