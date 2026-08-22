using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using backend.Controllers;
using backend.Data;
using backend.DTOs;
using backend.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using MongoDB.Driver;
using Xunit;
using Xunit.Abstractions;

namespace backend.Tests;

public class SubmissionControllerTests
{
    private readonly ITestOutputHelper _output;

    // xUnit injects the ITestOutputHelper here automatically
    public SubmissionControllerTests(ITestOutputHelper output)
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

    private static SubmissionsController Controller(
        Mock<MongoDbContext> context,
        string id = "student-1",
        string role = Role.Student)
    {
        var controller = new SubmissionsController(context.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = User(id, role)
                }
            }
        };

        return controller;
    }

    private static Mock<IAsyncCursor<T>> Cursor<T>(params T[] values)
    {
        var cursor = new Mock<IAsyncCursor<T>>();
        cursor.SetupGet(x => x.Current).Returns(values);
        cursor.SetupSequence(x => x.MoveNextAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(values.Length > 0)
            .ReturnsAsync(false);
        cursor.SetupSequence(x => x.MoveNext(It.IsAny<CancellationToken>()))
            .Returns(values.Length > 0)
            .Returns(false);
        return cursor;
    }

    private static void SetupFind<T>(
        Mock<IMongoCollection<T>> collection,
        params T[] values)
    {
        collection
            .Setup(x => x.FindAsync<T>(
                It.IsAny<FilterDefinition<T>>(),
                It.IsAny<FindOptions<T, T>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(Cursor(values).Object);
    }

    [Fact]
    public async Task SubmitAnswer_WithoutStudentClaim_ReturnsUnauthorized()
    {
        var context = new Mock<MongoDbContext>();
        var controller = new SubmissionsController(context.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity())
                }
            }
        };

        var dto = new SubmitAnswerDto { AssignmentId = "assignment-1", Answer = "answer" };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: SubmitAnswer_WithoutStudentClaim_ReturnsUnauthorized");
        _output.WriteLine($"DATA: AssignmentId='{dto.AssignmentId}', User='Anonymous' (No claims provided)");
        _output.WriteLine("EXPECTED: UnauthorizedResult (Must be logged in as student)");

        var result = await controller.SubmitAnswer(dto);

        result.Should().BeOfType<UnauthorizedResult>();

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public async Task SubmitAnswer_UnpublishedAssignment_ReturnsBadRequest()
    {
        var assignments = new Mock<IMongoCollection<Assignment>>();
        var submissions = new Mock<IMongoCollection<Submission>>();
        SetupFind(assignments, new Assignment
        {
            Id = "assignment-1",
            IsPublished = false,
            Deadline = DateTime.UtcNow.AddHours(1)
        });

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Assignments).Returns(assignments.Object);
        context.SetupGet(x => x.Submissions).Returns(submissions.Object);

        var dto = new SubmitAnswerDto { AssignmentId = "assignment-1", Answer = "answer" };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: SubmitAnswer_UnpublishedAssignment_ReturnsBadRequest");
        _output.WriteLine($"DATA: AssignmentId='{dto.AssignmentId}', IsPublished=False");
        _output.WriteLine("EXPECTED: BadRequestObjectResult (Cannot submit to drafts)");

        var result = await Controller(context).SubmitAnswer(dto);

        result.Should().BeOfType<BadRequestObjectResult>();
        submissions.Verify(
            x => x.InsertOneAsync(
                It.IsAny<Submission>(),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()),
            Times.Never);

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public async Task SubmitAnswer_AfterDeadline_ReturnsBadRequest()
    {
        var assignments = new Mock<IMongoCollection<Assignment>>();
        var submissions = new Mock<IMongoCollection<Submission>>();
        SetupFind(assignments, new Assignment
        {
            Id = "assignment-1",
            IsPublished = true,
            Deadline = DateTime.UtcNow.AddMinutes(-1)
        });

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Assignments).Returns(assignments.Object);
        context.SetupGet(x => x.Submissions).Returns(submissions.Object);

        var dto = new SubmitAnswerDto { AssignmentId = "assignment-1", Answer = "late" };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: SubmitAnswer_AfterDeadline_ReturnsBadRequest");
        _output.WriteLine($"DATA: AssignmentId='{dto.AssignmentId}', Deadline=Past (DateTime.UtcNow.AddMinutes(-1))");
        _output.WriteLine("EXPECTED: BadRequestObjectResult (Late submissions are rejected)");

        var result = await Controller(context).SubmitAnswer(dto);

        result.Should().BeOfType<BadRequestObjectResult>();
        submissions.Verify(
            x => x.InsertOneAsync(
                It.IsAny<Submission>(),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()),
            Times.Never);

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public async Task SubmitAnswer_DuplicateSubmission_ReturnsBadRequest()
    {
        var assignments = new Mock<IMongoCollection<Assignment>>();
        var submissions = new Mock<IMongoCollection<Submission>>();

        SetupFind(assignments, new Assignment
        {
            Id = "assignment-1",
            IsPublished = true,
            Deadline = DateTime.UtcNow.AddHours(1)
        });

        SetupFind(submissions, new Submission
        {
            Id = "submission-1",
            AssignmentId = "assignment-1",
            StudentId = "student-1",
            Status = "Submitted"
        });

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Assignments).Returns(assignments.Object);
        context.SetupGet(x => x.Submissions).Returns(submissions.Object);

        var dto = new SubmitAnswerDto { AssignmentId = "assignment-1", Answer = "again" };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: SubmitAnswer_DuplicateSubmission_ReturnsBadRequest");
        _output.WriteLine($"DATA: AssignmentId='{dto.AssignmentId}', StudentId='student-1' (Existing submission found)");
        _output.WriteLine("EXPECTED: BadRequestObjectResult (Duplicate submissions are blocked)");

        var result = await Controller(context).SubmitAnswer(dto);

        result.Should().BeOfType<BadRequestObjectResult>();
        submissions.Verify(
            x => x.InsertOneAsync(
                It.IsAny<Submission>(),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()),
            Times.Never);

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public async Task SubmitAnswer_ValidSubmission_CreatesSubmittedRecord()
    {
        var assignments = new Mock<IMongoCollection<Assignment>>();
        var submissions = new Mock<IMongoCollection<Submission>>();

        SetupFind(assignments, new Assignment
        {
            Id = "assignment-1",
            IsPublished = true,
            Deadline = DateTime.UtcNow.AddHours(1)
        });
        SetupFind(submissions);

        submissions
            .Setup(x => x.InsertOneAsync(
                It.IsAny<Submission>(),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Assignments).Returns(assignments.Object);
        context.SetupGet(x => x.Submissions).Returns(submissions.Object);

        var dto = new SubmitAnswerDto
        {
            AssignmentId = "assignment-1",
            Answer = "my answer",
            AttachmentUrl = "/uploads/a.pdf"
        };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: SubmitAnswer_ValidSubmission_CreatesSubmittedRecord");
        _output.WriteLine($"DATA: AssignmentId='{dto.AssignmentId}', StudentId='student-1', Answer='{dto.Answer}'");
        _output.WriteLine("EXPECTED: CreatedAtActionResult (Valid submission successfully saved)");

        var result = await Controller(context).SubmitAnswer(dto);

        result.Should().BeOfType<CreatedAtActionResult>();
        submissions.Verify(
            x => x.InsertOneAsync(
                It.Is<Submission>(s =>
                    s.AssignmentId == "assignment-1" &&
                    s.StudentId == "student-1" &&
                    s.Answer == "my answer" &&
                    s.AttachmentUrl == "/uploads/a.pdf" &&
                    s.Status == "Submitted"),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()),
            Times.Once);

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public async Task UpdateSubmission_OwnershipMismatch_ReturnsForbid()
    {
        var submissions = new Mock<IMongoCollection<Submission>>();
        SetupFind(submissions, new Submission
        {
            Id = "submission-1",
            AssignmentId = "assignment-1",
            StudentId = "another-student",
            Status = "Submitted"
        });

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Submissions).Returns(submissions.Object);

        var dto = new UpdateSubmissionDto { Answer = "changed" };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: UpdateSubmission_OwnershipMismatch_ReturnsForbid");
        _output.WriteLine($"DATA: SubmissionOwner='another-student', RequestingUser='student-1', SubmissionId='submission-1'");
        _output.WriteLine("EXPECTED: ForbidResult (Cannot modify another student's submission)");

        var result = await Controller(context).UpdateSubmission("submission-1", dto);

        result.Should().BeOfType<ForbidResult>();

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public async Task UpdateSubmission_GradedSubmission_ReturnsBadRequest()
    {
        var submissions = new Mock<IMongoCollection<Submission>>();
        var assignments = new Mock<IMongoCollection<Assignment>>();

        SetupFind(submissions, new Submission
        {
            Id = "submission-1",
            AssignmentId = "assignment-1",
            StudentId = "student-1",
            Status = "Graded"
        });
        SetupFind(assignments, new Assignment
        {
            Id = "assignment-1",
            Deadline = DateTime.UtcNow.AddHours(1)
        });

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Submissions).Returns(submissions.Object);
        context.SetupGet(x => x.Assignments).Returns(assignments.Object);

        var dto = new UpdateSubmissionDto { Answer = "changed" };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: UpdateSubmission_GradedSubmission_ReturnsBadRequest");
        _output.WriteLine($"DATA: SubmissionId='submission-1', Status='Graded', NewAnswer='{dto.Answer}'");
        _output.WriteLine("EXPECTED: BadRequestObjectResult (Graded submissions cannot be modified)");

        var result = await Controller(context).UpdateSubmission("submission-1", dto);

        result.Should().BeOfType<BadRequestObjectResult>();

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public async Task UpdateSubmission_AfterDeadline_ReturnsBadRequest()
    {
        var submissions = new Mock<IMongoCollection<Submission>>();
        var assignments = new Mock<IMongoCollection<Assignment>>();

        SetupFind(submissions, new Submission
        {
            Id = "submission-1",
            AssignmentId = "assignment-1",
            StudentId = "student-1",
            Status = "Submitted"
        });
        SetupFind(assignments, new Assignment
        {
            Id = "assignment-1",
            Deadline = DateTime.UtcNow.AddMinutes(-1)
        });

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Submissions).Returns(submissions.Object);
        context.SetupGet(x => x.Assignments).Returns(assignments.Object);

        var dto = new UpdateSubmissionDto { Answer = "too late" };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: UpdateSubmission_AfterDeadline_ReturnsBadRequest");
        _output.WriteLine($"DATA: SubmissionId='submission-1', Deadline=Past (DateTime.UtcNow.AddMinutes(-1))");
        _output.WriteLine("EXPECTED: BadRequestObjectResult (Cannot edit submission after deadline)");

        var result = await Controller(context).UpdateSubmission("submission-1", dto);

        result.Should().BeOfType<BadRequestObjectResult>();

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public async Task GradeSubmission_TeacherCannotGradeAnotherTeachersAssignment()
    {
        var submissions = new Mock<IMongoCollection<Submission>>();
        var assignments = new Mock<IMongoCollection<Assignment>>();

        SetupFind(submissions, new Submission
        {
            Id = "submission-1",
            AssignmentId = "assignment-1",
            StudentId = "student-1"
        });
        SetupFind(assignments, new Assignment
        {
            Id = "assignment-1",
            TeacherId = "teacher-owner",
            MaxMarks = 100
        });

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Submissions).Returns(submissions.Object);
        context.SetupGet(x => x.Assignments).Returns(assignments.Object);

        var dto = new GradeSubmissionDto { Marks = 80 };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: GradeSubmission_TeacherCannotGradeAnotherTeachersAssignment");
        _output.WriteLine($"DATA: AssignmentOwner='teacher-owner', RequestingTeacher='teacher-other', SubmissionId='submission-1'");
        _output.WriteLine("EXPECTED: ForbidResult (Only the original teacher who created the assignment can grade it)");

        var result = await Controller(
            context,
            id: "teacher-other",
            role: Role.Teacher).GradeSubmission("submission-1", dto);

        result.Should().BeOfType<ForbidResult>();

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(101)]
    public async Task GradeSubmission_MarksOutsideMaxRange_ReturnsBadRequest(double marks)
    {
        var submissions = new Mock<IMongoCollection<Submission>>();
        var assignments = new Mock<IMongoCollection<Assignment>>();

        SetupFind(submissions, new Submission
        {
            Id = "submission-1",
            AssignmentId = "assignment-1",
            StudentId = "student-1"
        });
        SetupFind(assignments, new Assignment
        {
            Id = "assignment-1",
            TeacherId = "teacher-1",
            MaxMarks = 100
        });

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Submissions).Returns(submissions.Object);
        context.SetupGet(x => x.Assignments).Returns(assignments.Object);

        var dto = new GradeSubmissionDto { Marks = marks };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: GradeSubmission_MarksOutsideMaxRange_ReturnsBadRequest");
        _output.WriteLine($"DATA: InputMarks={marks}, MaxMarks=100, LimitRange=(0 to 100)");
        _output.WriteLine("EXPECTED: BadRequestObjectResult (Marks must fall within the range 0 to MaxMarks)");

        var result = await Controller(
            context,
            id: "teacher-1",
            role: Role.Teacher).GradeSubmission("submission-1", dto);

        result.Should().BeOfType<BadRequestObjectResult>();
        submissions.Verify(
            x => x.UpdateOneAsync(
                It.IsAny<FilterDefinition<Submission>>(),
                It.IsAny<UpdateDefinition<Submission>>(),
                It.IsAny<UpdateOptions>(),
                It.IsAny<CancellationToken>()),
            Times.Never);

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public async Task GradeSubmission_RejectedSubmission_ClearsMarksAndReturnsOk()
    {
        var submissions = new Mock<IMongoCollection<Submission>>();
        var assignments = new Mock<IMongoCollection<Assignment>>();

        SetupFind(submissions, new Submission
        {
            Id = "submission-1",
            AssignmentId = "assignment-1",
            StudentId = "student-1"
        });
        SetupFind(assignments, new Assignment
        {
            Id = "assignment-1",
            TeacherId = "teacher-1",
            MaxMarks = 100
        });

        submissions
            .Setup(x => x.UpdateOneAsync(
                It.IsAny<FilterDefinition<Submission>>(),
                It.IsAny<UpdateDefinition<Submission>>(),
                It.IsAny<UpdateOptions>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(Mock.Of<UpdateResult>());

        var context = new Mock<MongoDbContext>();
        context.SetupGet(x => x.Submissions).Returns(submissions.Object);
        context.SetupGet(x => x.Assignments).Returns(assignments.Object);

        var dto = new GradeSubmissionDto
        {
            Marks = 0,
            Feedback = "Please revise",
            Status = "Rejected"
        };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: GradeSubmission_RejectedSubmission_ClearsMarksAndReturnsOk");
        _output.WriteLine($"DATA: Status='Rejected', Marks={dto.Marks}, Feedback='{dto.Feedback}'");
        _output.WriteLine("EXPECTED: OkObjectResult (Rejections reset grades and successfully pass the check)");

        var result = await Controller(
            context,
            id: "teacher-1",
            role: Role.Teacher).GradeSubmission("submission-1", dto);

        result.Should().BeOfType<OkObjectResult>();
        submissions.Verify(
            x => x.UpdateOneAsync(
                It.IsAny<FilterDefinition<Submission>>(),
                It.IsAny<UpdateDefinition<Submission>>(),
                It.IsAny<UpdateOptions>(),
                It.IsAny<CancellationToken>()),
            Times.Once);

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }
}