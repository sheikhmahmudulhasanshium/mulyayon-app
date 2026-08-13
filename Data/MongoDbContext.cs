using backend.Models;
using backend.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        _database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
    public IMongoCollection<Course> Courses => _database.GetCollection<Course>("Courses");
    public IMongoCollection<Subject> Subjects => _database.GetCollection<Subject>("Subjects");
    public IMongoCollection<Assignment> Assignments => _database.GetCollection<Assignment>("Assignments");
    public IMongoCollection<Submission> Submissions => _database.GetCollection<Submission>("Submissions");
}