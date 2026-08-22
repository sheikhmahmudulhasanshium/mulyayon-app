using System.Security.Claims;
using backend.Controllers;
using backend.Data;
using backend.DTOs;
using backend.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using MongoDB.Driver;
using Xunit.Abstractions;

namespace backend.Tests;

public class AssignmentControllerTests
{
    private readonly ITestOutputHelper _output;

    // xUnit injects the ITestOutputHelper here automatically
    public AssignmentControllerTests(ITestOutputHelper output)
    {
        _output = output;
    }

    private static ClaimsPrincipal User(string id, string role)
    {
        return new ClaimsPrincipal(new ClaimsIdentity(
            new[]
            {
                new Claim(ClaimTypes.NameIdentifier, id),
                new Claim(ClaimTypes.Role, role)
            },
            "TestAuth"));
    }

    private static AssignmentsController Controller(
        Mock<MongoDbContext> context,
        string id = "teacher-1",
        string role = Role.Teacher)
    {
        return new AssignmentsController(context.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = User(id, role)
                }
            }
        };
    }

    [Fact]
    public async Task CreateAssignment_SubjectMissing_ReturnsBadRequest()
    {
        var subjects = new Mock<IMongoCollection<Subject>>();
        MongoMockHelper.SetupFindSequence(subjects, Array.Empty<Subject>());

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Subjects).Returns(subjects.Object);

        var dto = new CreateAssignmentDto
        {
            Title = "Math Homework",
            Description = "Chapter 1",
            Deadline = DateTime.Now.AddDays(1),
            MaxMarks = 100,
            SubjectId = "subject-1"
        };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: CreateAssignment_SubjectMissing_ReturnsBadRequest");
        _output.WriteLine($"DATA (Input DTO): Title='{dto.Title}', SubjectId='{dto.SubjectId}'");
        _output.WriteLine("EXPECTED: BadRequestObjectResult (Subject missing in database)");

        var result = await Controller(context).CreateAssignment(dto);

        result.Should().BeOfType<BadRequestObjectResult>();
        
        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public async Task CreateAssignment_TeacherNotAssignedToSubject_ReturnsForbid()
    {
        var subjects = new Mock<IMongoCollection<Subject>>();
        var subject = new Subject
        {
            Id = "subject-1",
            Name = "Mathematics"
        };

        MongoMockHelper.SetupFindSequence(subjects, new[] { subject }, Array.Empty<Subject>());

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Subjects).Returns(subjects.Object);

        var dto = new CreateAssignmentDto
        {
            Title = "Math Homework",
            Description = "Chapter 1",
            Deadline = DateTime.Now.AddDays(1),
            MaxMarks = 100,
            SubjectId = "subject-1"
        };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: CreateAssignment_TeacherNotAssignedToSubject_ReturnsForbid");
        _output.WriteLine($"DATA (Input DTO): Title='{dto.Title}', SubjectId='{dto.SubjectId}', TeacherId='teacher-1'");
        _output.WriteLine("EXPECTED: ForbidResult (Teacher is not assigned to this subject)");

        var result = await Controller(context).CreateAssignment(dto);

        result.Should().BeOfType<ForbidResult>();

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public async Task CreateAssignment_ValidTeacherAndSubject_CreatesAssignment()
    {
        var subjects = new Mock<IMongoCollection<Subject>>();
        var assignments = new Mock<IMongoCollection<Assignment>>();

        var subject = new Subject
        {
            Id = "subject-1",
            Name = "Mathematics"
        };

        MongoMockHelper.SetupFindSequence(subjects, new[] { subject }, new[] { subject });

        assignments
            .Setup(x => x.InsertOneAsync(
                It.IsAny<Assignment>(),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Subjects).Returns(subjects.Object);
        context.SetupGet(x => x.Assignments).Returns(assignments.Object);

        var dto = new CreateAssignmentDto
        {
            Title = "Math Homework",
            Description = "Chapter 1",
            Deadline = DateTime.Now.AddDays(1),
            MaxMarks = 100,
            SubjectId = "subject-1",
            IsPublished = true,
            AttachmentUrl = "/uploads/math.pdf"
        };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: CreateAssignment_ValidTeacherAndSubject_CreatesAssignment");
        _output.WriteLine($"DATA (Input DTO): Title='{dto.Title}', SubjectId='{dto.SubjectId}', MaxMarks={dto.MaxMarks}, IsPublished={dto.IsPublished}");
        _output.WriteLine("EXPECTED: CreatedAtActionResult (Valid assignment successfully saved)");

        var result = await Controller(context).CreateAssignment(dto);

        result.Should().BeOfType<CreatedAtActionResult>();

        assignments.Verify(
            x => x.InsertOneAsync(
                It.Is<Assignment>(a =>
                    a.Title == "Math Homework" &&
                    a.SubjectId == "subject-1" &&
                    a.TeacherId == "teacher-1" &&
                    a.MaxMarks == 100 &&
                    a.IsPublished &&
                    a.AttachmentUrl == "/uploads/math.pdf"),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()),
            Times.Once);

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public async Task UpdateAssignment_AnotherTeachersAssignment_ReturnsForbid()
    {
        var assignments = new Mock<IMongoCollection<Assignment>>();

        MongoMockHelper.SetupFindSequence(assignments, new[]
        {
            new Assignment
            {
                Id = "assignment-1",
                TeacherId = "teacher-owner",
                Title = "Original"
            }
        });

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Assignments).Returns(assignments.Object);

        var dto = new UpdateAssignmentDto { Title = "Attempted change" };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: UpdateAssignment_AnotherTeachersAssignment_ReturnsForbid");
        _output.WriteLine($"DATA (Input DTO): NewTitle='{dto.Title}', CurrentTeacher='teacher-other', OwnerTeacher='teacher-owner'");
        _output.WriteLine("EXPECTED: ForbidResult (Cannot modify assignments created by other teachers)");

        var result = await Controller(context, "teacher-other").UpdateAssignment(
            "assignment-1",
            dto);

        result.Should().BeOfType<ForbidResult>();

        assignments.Verify(
            x => x.UpdateOneAsync(
                It.IsAny<FilterDefinition<Assignment>>(),
                It.IsAny<UpdateDefinition<Assignment>>(),
                It.IsAny<UpdateOptions>(),
                It.IsAny<CancellationToken>()),
            Times.Never);

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }
}