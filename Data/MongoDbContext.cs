using backend.Models;
using backend.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Data;

public class MongoDbContext
{
    // The null-forgiving operator (null!) silences the compiler warning for the parameterless constructor
    private readonly IMongoDatabase _database = null!;

    // Required by Moq to generate mock objects in the test suite
    public MongoDbContext() { }

    public MongoDbContext(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        _database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public virtual IMongoCollection<User> Users => _database.GetCollection<User>("Users");
    public virtual IMongoCollection<Course> Courses => _database.GetCollection<Course>("Courses");
    public virtual IMongoCollection<Subject> Subjects => _database.GetCollection<Subject>("Subjects");
    public virtual IMongoCollection<Assignment> Assignments => _database.GetCollection<Assignment>("Assignments");
    public virtual IMongoCollection<Submission> Submissions => _database.GetCollection<Submission>("Submissions");
}