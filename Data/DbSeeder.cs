using backend.Models;
using MongoDB.Driver;
using BCrypt.Net;
using Serilog;
namespace backend.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(MongoDbContext context)
    {
        // 1. Seed default Course
        var courseCount = await context.Courses.CountDocumentsAsync(Builders<Course>.Filter.Empty);
        Course defaultCourse;
        if (courseCount == 0)
        {
            defaultCourse = new Course { Name = "Class 10" };
            await context.Courses.InsertOneAsync(defaultCourse);
        }
        else
        {
            defaultCourse = await context.Courses.Find(Builders<Course>.Filter.Empty).FirstAsync();
        }

        // 2. Seed default Subject
        var subjectCount = await context.Subjects.CountDocumentsAsync(Builders<Subject>.Filter.Empty);
        if (subjectCount == 0)
        {
            var defaultSubject = new Subject { Name = "Computer Science", CourseId = defaultCourse.Id! };
            await context.Subjects.InsertOneAsync(defaultSubject);
        }

        // 3. Seed Users
        var userCount = await context.Users.CountDocumentsAsync(Builders<User>.Filter.Empty);
        if (userCount == 0)
        {
            var users = new List<User>
            {
                new User
                {
                    Name = "School Admin",
                    Email = "admin@school.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = backend.Models.Role.Admin
                },
                new User
                {
                    Name = "John Teacher",
                    Email = "teacher@school.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Teacher@123"),
                    Role = backend.Models.Role.Teacher
                },
                new User
                {
                    Name = "Alex Student",
                    Email = "student@school.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    Role = backend.Models.Role.Student,
                    CourseId = defaultCourse.Id
                }
            };
            await context.Users.InsertManyAsync(users);
            Log.Information("3-users-added-----id:system-----type:seed-engine");

        }
    }
}