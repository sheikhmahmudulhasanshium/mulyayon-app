using backend.Data;
using backend.Services;
using backend.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Serilog; 

var builder = WebApplication.CreateBuilder(args);
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console(outputTemplate: "{Timestamp:HH:mm:ss-dd-MMM-yyyy}-----{Message:lj}{NewLine}{Exception}")
    .WriteTo.File(
        path: "logs/system_logs-.txt", 
        rollingInterval: RollingInterval.Day, // Creates a new file daily (prevents infinite growth)
        outputTemplate: "{Timestamp:HH:mm:ss-dd-MMM-yyyy}-----{Message:lj}{NewLine}{Exception}")
    .CreateLogger();

// Bind Configuration Settings
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

// Register Services & DB Context
builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddScoped<ITokenService, TokenService>();

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
        ClockSkew = TimeSpan.Zero
    };
});

builder.Host.UseSerilog();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// Configure Swagger to display the Authorize Lock Icon and accept JWT tokens
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo 
    { 
        Title = "School Management API", 
        Version = "v1" 
    });

    // 1. Define the JWT Bearer Security Scheme
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your JWT token directly. Example: 'eyJhG...'"
    });

    // 2. Apply this Security Requirement globally across all endpoints
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
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
        Console.WriteLine("Connecting to MongoDB and checking database state...");
        var context = scope.ServiceProvider.GetRequiredService<MongoDbContext>();
        await DbSeeder.SeedAsync(context);
        Console.WriteLine("Database check and seeding completed successfully.");
    }
    catch (Exception ex)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"Database seeding failed: {ex.Message}");
        Console.ResetColor();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication(); // Must be placed before UseAuthorization
app.UseAuthorization();

app.MapControllers();
// 4. Log Server Online using Serilog
Log.Information("server-online-----id:system_kernel");

app.Run();