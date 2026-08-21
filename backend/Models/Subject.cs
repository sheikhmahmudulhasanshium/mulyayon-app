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

    [BsonElement("nameBn")]
    public string NameBn { get; set; } = string.Empty; // Added to match seeder properties

    [BsonElement("courseId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CourseId { get; set; } = string.Empty;

    // CHANGED: Represent multiple assigned teachers as an array of ObjectIds
    [BsonElement("teacherIds")]
    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> TeacherIds { get; set; } = new();
}