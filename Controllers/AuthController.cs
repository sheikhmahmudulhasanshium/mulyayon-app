using backend.Data;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using BCrypt.Net;
using Serilog;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MongoDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthController(MongoDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        // 1. Find the user by Email
        var user = await _context.Users
            .Find(u => u.Email == loginDto.Email)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            Log.Warning("user-login-failed-----id:{Email}-----type:unknown-----reason:email-not-found", loginDto.Email);
            return Unauthorized(new { message = "Invalid email or password" });
            }

        // 2. Verify hashed password with BCrypt
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            Log.Warning("user-login-failed-----id:{Id}-----type:{Role}-----reason:password-mismatch", user.Id, user.Role);

            return Unauthorized(new { message = "Invalid email or password" });
        }

        // 3. Generate JWT Token
        var token = _tokenService.GenerateToken(user);
        Log.Information("user-login-success-----id:{Id}-----type:{Role}", user.Id, user.Role);

        return Ok(new
        {
            token,
            user = new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role,
                user.CourseId
            }
        });
    }
}