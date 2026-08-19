using backend.Data;
using backend.Services;
using backend.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console(outputTemplate: "{Timestamp:HH:mm:ss-dd-MMM-yyyy}-----{Message:lj}{NewLine}{Exception}")
    .WriteTo.File(
        path: "logs/system_logs-.txt", 
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:HH:mm:ss-dd-MMM-yyyy}-----{Message:lj}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();

// Bind Configurations
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

// Register Services
builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddScoped<ITokenService, TokenService>();

// 3. Configure Built-In IP-Based Rate Limiting (DDoS Mitigation)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 60, 
                QueueLimit = 0,   
                Window = TimeSpan.FromMinutes(1) 
            }));
});

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>() 
                  ?? throw new InvalidOperationException("JWT Configuration is missing.");

var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.FromSeconds(30)
    };
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 1. Configure CORS (Correct top-level placement - outside of Swagger options block)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://mulyayon.vercel.app") // Local dev and production URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Allows cookies/tokens to pass safely
    });
});

// 2. Configure Swagger with Authorize locks
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "School API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter JWT token directly."
    });
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Run Database Seeder
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<MongoDbContext>();
        await DbSeeder.SeedAsync(context);
    }
    catch (Exception ex)
    {
        Log.Fatal($"Database seeding failed: {ex.Message}");
    }
}

// Swagger enabled for all environments (including production on Render)
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "School API v1");
    options.RoutePrefix = string.Empty; // Serves the Swagger UI page directly at the root URL (/)
});

app.UseHttpsRedirection();
app.UseStaticFiles(); 
app.UseRateLimiter(); 

app.UseCors("AllowFrontend"); // <-- Correctly placed middleware pipeline execution

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

Log.Information("server-online-----id:system_kernel");

app.Run();