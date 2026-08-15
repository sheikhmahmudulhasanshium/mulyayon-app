using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires users to be logged in to upload files
public class UploadController : ControllerBase
{
    private readonly string _uploadsFolder;

    public UploadController()
    {
        // Dynamically locate/create "wwwroot/uploads" relative to the running folder
        _uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        
        if (!Directory.Exists(_uploadsFolder))
        {
            Directory.CreateDirectory(_uploadsFolder);
        }
    }

    [HttpPost]
    [Consumes("multipart/form-data")] // Expects file upload payloads
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded or file is empty." });
        }

        // Limit file size to 10MB to protect your local storage
        if (file.Length > 10 * 1024 * 1024)
        {
            return BadRequest(new { message = "File size exceeds the maximum limit of 10MB." });
        }

        // Validate allowed extensions (PDF, PNG, JPG, DOCX, ZIP)
        var allowedExtensions = new[] { ".pdf", ".png", ".jpg", ".jpeg", ".docx", ".zip" };
        var extension = Path.GetExtension(file.FileName).ToLower();
        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Unsupported file format. Allowed formats: PDF, PNG, JPG, DOCX, ZIP." });
        }

        // Generate a completely unique filename to prevent overwriting existing files
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(_uploadsFolder, uniqueFileName);

        // Save the file asynchronously
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Construct the public URL to return to the client
        var request = HttpContext.Request;
        var publicUrl = $"{request.Scheme}://{request.Host}/uploads/{uniqueFileName}";

        Log.Information("file-upload-success-----id:{UserId}-----fname:{OriginalName}-----size:{Size}MB", 
            User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value,
            file.FileName,
            Math.Round((double)file.Length / (1024 * 1024), 2));

        return Ok(new { url = publicUrl });
    }
}