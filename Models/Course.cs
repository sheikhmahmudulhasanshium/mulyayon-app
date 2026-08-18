using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class Course
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    
    public string Name { get; set; } = string.Empty; // e.g., "Class 10"
    
    [BsonElement("nameBn")]
    public string NameBn { get; set; } = string.Empty; // e.g., "দশম শ্রেণী"
    
    [BsonElement("level")]
    public string Level { get; set; } = string.Empty; // "Primary" (1-5) or "Secondary" (6-10)
        [BsonElement("version")]
    public string Version { get; set; } = string.Empty; // "Bangla" (BV) or "English" (EV)
     public int Order { get; set; } 


}