using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;

    [BsonElement("passwordHash")]
    [JsonIgnore] 
    public string PasswordHash { get; set; } = string.Empty;

    [BsonElement("role")]
    public string Role { get; set; } = string.Empty; // "Admin", "Teacher", "Student"

    [BsonElement("courseId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? CourseId { get; set; } // Nullable (Students only)

    // ADD THESE OPTIONAL PROPERTIES FOR TEACHERS:
    [BsonElement("specialties")]
    public List<string>? Specialties { get; set; }

    [BsonElement("versions")]
    public List<string>? Versions { get; set; }

    [BsonElement("levels")]
    public List<string>? Levels { get; set; }
}