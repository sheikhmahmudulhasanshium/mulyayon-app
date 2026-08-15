using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class Subject
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty; // English term

    [BsonElement("nameBn")]
    public string NameBn { get; set; } = string.Empty; // Bangla term

    [BsonElement("courseId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CourseId { get; set; } = string.Empty;

    [BsonElement("teacherId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? TeacherId { get; set; } // Nullable (Assigned by Admin)
}