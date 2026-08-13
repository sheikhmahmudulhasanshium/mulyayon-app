using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class Subject
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("courseId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CourseId { get; set; } = string.Empty; // Links to Class/Course

    [BsonElement("teacherId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? TeacherId { get; set; } // Links to assigned Teacher User (Nullable)
}