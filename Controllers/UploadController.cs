using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UploadController : ControllerBase
{
    private readonly Cloudinary _cloudinary;

    public UploadController()
    {
        _cloudinary = new Cloudinary();
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded or file is empty." });
        }

        if (file.Length > 10 * 1024 * 1024)
        {
            return BadRequest(new { message = "File size exceeds the maximum limit of 10MB." });
        }

        var allowedExtensions = new[] { ".pdf", ".png", ".jpg", ".jpeg", ".docx", ".zip" };
        var extension = Path.GetExtension(file.FileName).ToLower();
        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Unsupported file format. Allowed formats: PDF, PNG, JPG, DOCX, ZIP." });
        }

        try
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                PublicId = $"mulyayon_uploads/{Guid.NewGuid()}{extension}"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                return BadRequest(new { message = uploadResult.Error.Message });
            }

            var secureUrl = uploadResult.SecureUrl.ToString();

            Log.Information("file-upload-success-----id:{UserId}-----fname:{OriginalName}-----size:{Size}MB-----url:{Url}", 
                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value,
                file.FileName,
                Math.Round((double)file.Length / (1024 * 1024), 2),
                secureUrl);

            return Ok(new { url = secureUrl });
        }
        catch (Exception ex)
        {
            Log.Error("file-upload-failed-----id:{UserId}-----fname:{OriginalName}-----error:{Error}",
                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value,
                file.FileName,
                ex.Message);

            return StatusCode(500, new { message = $"Cloud upload failed: {ex.Message}" });
        }
    }
}