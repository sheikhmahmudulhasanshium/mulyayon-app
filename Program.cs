using backend.Data;
using backend.Settings;

var builder = WebApplication.CreateBuilder(args);

// Configure MongoDB Settings
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

// Register MongoDB Context
builder.Services.AddSingleton<MongoDbContext>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Safe Auto-seeding with Error Logging
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
        Console.WriteLine("--------------------------------------------------");
        Console.WriteLine("CRITICAL ERROR DURING DATABASE SEEDING:");
        Console.WriteLine(ex.Message);
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner Details: {ex.InnerException.Message}");
        }
        Console.WriteLine("Please check your MongoDB Connection String and Atlas IP access.");
        Console.WriteLine("--------------------------------------------------");
        Console.ResetColor();
        
        // Let the app continue starting up so you can access Swagger even if database fails
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();