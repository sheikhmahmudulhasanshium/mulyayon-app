using backend.Data;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Diagnostics;
using backend.Models;
namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly MongoDbContext _context;
    private static readonly DateTime StartupTime = DateTime.UtcNow;

    public HealthController(MongoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> CheckHealth()
    {
        var dbStatus = "Healthy";
        var dbLatencyMs = 0L;

        try
        {
            var stopwatch = Stopwatch.StartNew();
            
            // Perform a fast, cheap operation to verify MongoDB is connected and responsive
            await _context.Users.CountDocumentsAsync(Builders<User>.Filter.Empty);
            
            stopwatch.Stop();
            dbLatencyMs = stopwatch.ElapsedMilliseconds;
        }
        catch (Exception)
        {
            dbStatus = "Unhealthy (Disconnected)";
        }

        var isSystemHealthy = dbStatus == "Healthy";

        var healthReport = new
        {
            status = isSystemHealthy ? "Healthy" : "Unhealthy",
            timestamp = DateTime.UtcNow,
            uptime = DateTime.UtcNow - StartupTime,
            services = new
            {
                database = new
                {
                    status = dbStatus,
                    latencyMs = dbLatencyMs
                },
                server = new
                {
                    status = "Healthy"
                }
            }
        };

        if (!isSystemHealthy)
        {
            return StatusCode(503, healthReport); // Return 503 Service Unavailable if DB is down
        }

        return Ok(healthReport);
    }
}