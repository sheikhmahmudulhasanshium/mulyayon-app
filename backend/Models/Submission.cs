using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class Submission
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("assignmentId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string AssignmentId { get; set; } = string.Empty;

    [BsonElement("studentId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string StudentId { get; set; } = string.Empty;

    [BsonElement("submittedAt")]
    public DateTime SubmittedAt { get; set; }

    [BsonElement("answer")]
    public string Answer { get; set; } = string.Empty;

    [BsonElement("attachmentUrl")]
    public string? AttachmentUrl { get; set; } // Holds the URL of the Student's uploaded local homework PDF/Image (Nullable)

    [BsonElement("marks")]
    public double? Marks { get; set; } // Nullable until graded by Teacher

    [BsonElement("feedback")]
    public string Feedback { get; set; } = string.Empty;

    [BsonElement("status")]
    public string Status { get; set; } = "Submitted"; // "Submitted" or "Graded"
}