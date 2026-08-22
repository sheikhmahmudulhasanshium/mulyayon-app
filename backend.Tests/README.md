# Mulyayon backend tests

This test project is intentionally kept separate from the production backend.

It covers:

- assignment creation/ownership rules
- published/deadline submission rules
- duplicate submission prevention
- student ownership checks
- graded-submission update restrictions
- teacher resource-level authorization
- grade range validation
- rejected submission workflow
- JWT identity/role/issuer/audience/expiry
- existing DTO DataAnnotations validation

## Run

From the repository root:

```bash
dotnet test backend.Tests
```

Or:

```bash
cd backend.Tests
dotnet test
```

No MongoDB connection is required for these unit tests.

The tests use Moq against the existing `MongoDbContext` and MongoDB collection interfaces. No controller or production business-rule rewrite is required.

The MongoDB collection mocks support both `Find(...).FirstOrDefaultAsync()` and `Find(...).AnyAsync()`, matching the current production controller usage.
