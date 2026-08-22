using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using backend.DTOs;
using FluentAssertions;
using Xunit;
using Xunit.Abstractions;

namespace backend.Tests;

public class ValidationTests
{
    private readonly ITestOutputHelper _output;

    // xUnit injects the ITestOutputHelper here automatically
    public ValidationTests(ITestOutputHelper output)
    {
        _output = output;
    }

    private static bool IsValid(object model, out List<ValidationResult> errors)
    {
        errors = new List<ValidationResult>();
        return Validator.TryValidateObject(
            model,
            new ValidationContext(model),
            errors,
            validateAllProperties: true);
    }

    [Fact]
    public void CreateAssignmentDto_RejectsMissingTitle()
    {
        var dto = new CreateAssignmentDto
        {
            Title = "",
            Description = "Description",
            Deadline = DateTime.UtcNow.AddDays(1),
            MaxMarks = 100,
            SubjectId = "subject-1"
        };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: CreateAssignmentDto_RejectsMissingTitle");
        _output.WriteLine($"DATA: DTO with Title='{dto.Title}' (Empty string)");
        _output.WriteLine("EXPECTED: Validation fails with error: 'Title is required'");

        var isValid = IsValid(dto, out var errors);

        isValid.Should().BeFalse();
        errors.Should().ContainSingle(e => e.ErrorMessage == "Title is required");

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public void CreateAssignmentDto_RejectsMaxMarksBelowOne()
    {
        var dto = new CreateAssignmentDto
        {
            Title = "Assignment",
            Description = "Description",
            Deadline = DateTime.UtcNow.AddDays(1),
            MaxMarks = 0,
            SubjectId = "subject-1"
        };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: CreateAssignmentDto_RejectsMaxMarksBelowOne");
        _output.WriteLine($"DATA: DTO with MaxMarks={dto.MaxMarks}");
        _output.WriteLine("EXPECTED: Validation fails (MaxMarks must be at least 1)");

        var isValid = IsValid(dto, out _);

        isValid.Should().BeFalse();

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public void CreateAssignmentDto_RejectsMaxMarksAboveOneThousand()
    {
        var dto = new CreateAssignmentDto
        {
            Title = "Assignment",
            Description = "Description",
            Deadline = DateTime.UtcNow.AddDays(1),
            MaxMarks = 1001,
            SubjectId = "subject-1"
        };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: CreateAssignmentDto_RejectsMaxMarksAboveOneThousand");
        _output.WriteLine($"DATA: DTO with MaxMarks={dto.MaxMarks}");
        _output.WriteLine("EXPECTED: Validation fails (MaxMarks cannot exceed 1000)");

        var isValid = IsValid(dto, out _);

        isValid.Should().BeFalse();

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public void CreateAssignmentDto_AcceptsValidValues()
    {
        var dto = new CreateAssignmentDto
        {
            Title = "Assignment",
            Description = "Description",
            Deadline = DateTime.UtcNow.AddDays(1),
            MaxMarks = 100,
            SubjectId = "subject-1"
        };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: CreateAssignmentDto_AcceptsValidValues");
        _output.WriteLine($"DATA: Title='{dto.Title}', MaxMarks={dto.MaxMarks}, SubjectId='{dto.SubjectId}'");
        _output.WriteLine("EXPECTED: Validation succeeds with no errors");

        var isValid = IsValid(dto, out var errors);

        isValid.Should().BeTrue();
        errors.Should().BeEmpty();

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public void SubmitAnswerDto_RequiresAssignmentId()
    {
        var dto = new SubmitAnswerDto { Answer = "answer" };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: SubmitAnswerDto_RequiresAssignmentId");
        _output.WriteLine($"DATA: SubmitAnswerDto with AssignmentId=null (Missing)");
        _output.WriteLine("EXPECTED: Validation fails with error: 'Assignment ID is required'");

        var isValid = IsValid(dto, out var errors);

        isValid.Should().BeFalse();
        errors.Should().ContainSingle(e => e.ErrorMessage == "Assignment ID is required");

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }
}