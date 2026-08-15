using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class Assignment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("deadline")]
    public DateTime Deadline { get; set; }

    [BsonElement("maxMarks")]
    public double MaxMarks { get; set; }

    [BsonElement("isPublished")]
    public bool IsPublished { get; set; }

    [BsonElement("attachmentUrl")]
    public string? AttachmentUrl { get; set; } // Holds the URL of the uploaded local file (PDF/Image)

    [BsonElement("subjectId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string SubjectId { get; set; } = string.Empty;

    [BsonElement("teacherId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string TeacherId { get; set; } = string.Empty;
}