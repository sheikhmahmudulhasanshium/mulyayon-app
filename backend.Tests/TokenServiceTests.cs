using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using backend.Models;
using backend.Services;
using backend.Settings;
using FluentAssertions;
using Microsoft.Extensions.Options;
using Xunit;
using Xunit.Abstractions;

namespace backend.Tests;

public class TokenServiceTests
{
    private readonly ITestOutputHelper _output;

    // xUnit injects the ITestOutputHelper here automatically
    public TokenServiceTests(ITestOutputHelper output)
    {
        _output = output;
    }

    private static TokenService CreateService(
        string secret = "this-is-a-long-test-secret-key-123456789")
    {
        var settings = new JwtSettings
        {
            SecretKey = secret,
            Issuer = "mulyayon-test",
            Audience = "mulyayon-client",
            ExpiryInMinutes = 30
        };

        return new TokenService(Options.Create(settings));
    }

    [Fact]
    public void GenerateToken_ReturnsReadableJwt()
    {
        var user = new User
        {
            Id = "user-1",
            Name = "Test User",
            Email = "test@example.com",
            Role = Role.Student
        };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: GenerateToken_ReturnsReadableJwt");
        _output.WriteLine($"DATA: UserId='{user.Id}', Name='{user.Name}', Email='{user.Email}', Role='{user.Role}'");
        _output.WriteLine("EXPECTED: Successfully generated, non-empty, well-formed JWT string");

        var token = CreateService().GenerateToken(user);

        token.Should().NotBeNullOrWhiteSpace();

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
        jwt.Should().NotBeNull();
        jwt.Claims.Should().NotBeEmpty();

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public void GenerateToken_ContainsExpectedIdentityClaims()
    {
        var user = new User
        {
            Id = "user-123",
            Name = "Student One",
            Email = "student@example.com",
            Role = Role.Student
        };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: GenerateToken_ContainsExpectedIdentityClaims");
        _output.WriteLine($"DATA: UserId='{user.Id}', Name='{user.Name}', Email='{user.Email}', Role='{user.Role}'");
        _output.WriteLine("EXPECTED: Generated JWT claims contain exact matching identity values");

        var token = CreateService().GenerateToken(user);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        jwt.Claims.Should().Contain(c => c.Value == "user-123");
        jwt.Claims.Should().Contain(c => c.Value == "Student One");
        jwt.Claims.Should().Contain(c => c.Value == "student@example.com");
        jwt.Claims.Should().Contain(c => c.Value == Role.Student);

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public void GenerateToken_ContainsConfiguredIssuerAndAudience()
    {
        var user = new User
        {
            Id = "user-1",
            Name = "Teacher",
            Email = "teacher@example.com",
            Role = Role.Teacher
        };

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: GenerateToken_ContainsConfiguredIssuerAndAudience");
        _output.WriteLine($"DATA: TargetIssuer='mulyayon-test', TargetAudience='mulyayon-client'");
        _output.WriteLine("EXPECTED: Token contains matching Issuer and Audience claims");

        var token = CreateService().GenerateToken(user);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        jwt.Issuer.Should().Be("mulyayon-test");
        jwt.Audiences.Should().Contain("mulyayon-client");

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }

    [Fact]
    public void GenerateToken_SetsFutureExpiry()
    {
        var before = DateTime.UtcNow.AddMinutes(29);
        var user = new User
        {
            Id = "user-1",
            Name = "Admin",
            Email = "admin@example.com",
            Role = Role.Admin
        };
        var after = DateTime.UtcNow.AddMinutes(31);

        _output.WriteLine("==================================================");
        _output.WriteLine("TEST: GenerateToken_SetsFutureExpiry");
        _output.WriteLine($"DATA: ExpiryInMinutes=30, BufferRange=({before:HH:mm:ss} to {after:HH:mm:ss})");
        _output.WriteLine("EXPECTED: Token 'ValidTo' field falls approximately 30 minutes in the future");

        var token = CreateService().GenerateToken(user);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        jwt.ValidTo.Should().BeAfter(before);
        jwt.ValidTo.Should().BeBefore(after);

        _output.WriteLine("RESULT: Passed");
        _output.WriteLine("==================================================");
    }
}