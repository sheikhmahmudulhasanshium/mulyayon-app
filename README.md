<p align="center">
  <img src="https://raw.githubusercontent.com/sheikhmahmudulhasanshium/mulyayon-app/refs/heads/main/frontend/public/logo/logo-bn.png" alt="Mulyayon App Logo" width="180"/>
</p>

# মূল্যায়ন (Mulyayon) — Assignment & Submission Management System

### Assistant Software Engineer Recruitment Project — OnnoRokom Projukti Limited

A role-based academic assignment and submission management system designed for managing courses, subjects, assignments, student submissions, grading, and role-specific academic workflows.

The project is organized as a single monorepo containing both the Next.js frontend and ASP.NET Core backend.

---

## 1. Project Overview

Mulyayon provides separate portals and permissions for three primary roles.

### Admin Portal

- Manage users
- Manage courses/classes
- Manage subjects
- Manage teachers
- Allocate teachers to courses and subjects
- View system-wide academic information

### Teacher Portal

- View assigned courses and students
- Create assignments
- Save assignments as drafts
- Publish assignments
- Set assignment deadlines
- Configure grade/weightage
- Review student submissions
- Assign marks
- Provide feedback
- Track assignment and submission status

### Student Portal

- View enrolled subjects/courses
- View available assignments
- View assignment deadlines
- Submit assignments
- Track submission status
- View marks
- View teacher feedback
- View classmates

---

## 2. Technology Stack

### Frontend

- Next.js 16.3.1
- React 19.2.8
- TypeScript 5.9.3
- Tailwind CSS 4.3.3
- Next.js App Router
- Next Intl / localized routing
- pnpm
- Framer Motion
- Radix/shadcn-style UI components

### Backend

- ASP.NET Core Web API
- .NET 8.0
- C#
- Swagger / OpenAPI
- JWT Authentication
- Role-based authorization
- Serilog

### Database

- MongoDB
- MongoDB.Driver 3.11.0

### File / Media Storage

- Cloudinary
- CloudinaryDotNet

### Authentication

- Stateless JWT authentication
- Role-based authorization for:
  - Admin
  - Teacher
  - Student

---
### 3.1. Repository Structure

This repository is structured to manage the complete application codebase in one location while preserving individual deployment pipelines:

*   **Parent Consolidated Repository:** [mulyayon-app](https://github.com/sheikhmahmudulhasanshium/mulyayon-app)
*   **Frontend Source Directory:** `/frontend` (Originated from [onno-rokom-frontend](https://github.com/sheikhmahmudulhasanshium/onno-rokom-frontend))
*   **Backend Source Directory:** `/backend` (Originated from [onno-rokom-backend](https://github.com/sheikhmahmudulhasanshium/onno-rokom-backend))

---

### 3.2. Live Deployments

*   **Frontend Service:** [https://mulyayon.vercel.app/](https://mulyayon.vercel.app/)
*   **Backend API Documentation:** [https://onno-rokom-backend.onrender.com/index.html](https://onno-rokom-backend.onrender.com/index.html)


### 3.3. Project Structure

The repository contains both applications inside the same project:

```text
mulyayon-app/
│
├── frontend/                         # Next.js application
│   │
│   ├── app/
│   │   ├── [lang]/
│   │   │   ├── (routes)/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── sign-in/
│   │   │   │   │   │   ├── body.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   │   └── sign-out/
│   │   │   │   │       ├── body.tsx
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── about/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── courses/
│   │   │   │   │   ├── subjects/
│   │   │   │   │   ├── teachers/
│   │   │   │   │   └── users/
│   │   │   │   ├── faq/
│   │   │   │   ├── privacy/
│   │   │   │   ├── student/
│   │   │   │   │   ├── assignments/
│   │   │   │   │   ├── classmates/
│   │   │   │   │   ├── grades/
│   │   │   │   │   └── subjects/
│   │   │   │   ├── teacher/
│   │   │   │   │   ├── assignments/
│   │   │   │   │   ├── colleagues/
│   │   │   │   │   ├── courses/
│   │   │   │   │   ├── students/
│   │   │   │   │   └── subjects/
│   │   │   │   └── terms/
│   │   │   │
│   │   │   ├── landing/
│   │   │   ├── [...not-found]/
│   │   │   ├── layout.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── page.tsx
│   │   │
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── buttons/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── SystemHealthIndicator.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── admin/
│   │   │   ├── teacher/
│   │   │   └── sign-in-form.tsx
│   │   │
│   │   └── ui/
│   │
│   ├── hooks/
│   │   ├── admin/
│   │   ├── common/
│   │   ├── student/
│   │   └── teacher/
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   │
│   ├── auth-provider.tsx
│   ├── language-provider.tsx
│   ├── page-provider.tsx
│   ├── theme-provider.tsx
│   ├── logo-animated-bn.tsx
│   ├── logo-animated-en.tsx
│   └── api.tsx
│
│
├── backend/                          # ASP.NET Core Web API
│   │
│   ├── Controllers/
│   │   ├── AdminController.cs
│   │   ├── AssignmentsController.cs
│   │   ├── AuthController.cs
│   │   ├── HealthController.cs
│   │   ├── PublicController.cs
│   │   ├── StudentController.cs
│   │   ├── SubmissionsController.cs
│   │   ├── TeacherController.cs
│   │   └── UploadController.cs
│   │
│   ├── Data/
│   │   ├── DbSeeder.cs
│   │   ├── MongoDbContext.cs
│   │   ├── student.json
│   │   └── teacher.json
│   │
│   ├── DTOs/
│   │   ├── AdminDtos.cs
│   │   ├── AssignmentDtos.cs
│   │   ├── LoginDto.cs
│   │   └── SubmissionDtos.cs
│   │
│   ├── Models/
│   │   ├── Assignment.cs
│   │   ├── Course.cs
│   │   ├── Role.cs
│   │   ├── Subject.cs
│   │   ├── Submission.cs
│   │   └── User.cs
│   │
│   ├── Services/
│   │   ├── ITokenService.cs
│   │   └── TokenService.cs
│   │
│   ├── Settings/
│   │   ├── JwtSettings.cs
│   │   └── MongoDbSettings.cs
│   │
│   ├── Properties/
│   │   └── launchSettings.json
│   │
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── backend.csproj
│   ├── Dockerfile
│   └── Program.cs
│
└── README.md
````

> Build artifacts such as `frontend/.next`, `backend/bin`, and `backend/obj` are intentionally omitted from the logical project structure above.

---

## 4. Backend Architecture

The backend follows a lightweight layered organization:

```text
Controllers
    ↓
DTOs / Models
    ↓
Services
    ↓
Data Access
    ↓
MongoDB
```

### Controllers

| Controller              | Responsibility                   |
| ----------------------- | -------------------------------- |
| `AuthController`        | Authentication and login         |
| `AdminController`       | Administrative operations        |
| `TeacherController`     | Teacher-specific operations      |
| `StudentController`     | Student-specific operations      |
| `AssignmentsController` | Assignment management            |
| `SubmissionsController` | Submission and grading workflows |
| `UploadController`      | File/media uploads               |
| `PublicController`      | Public application data          |
| `HealthController`      | API/system health                |

### Data

`MongoDbContext` provides MongoDB access while `DbSeeder` initializes sample application data.

Seed data is also provided for students and teachers:

```text
backend/Data/
├── DbSeeder.cs
├── MongoDbContext.cs
├── student.json
└── teacher.json
```

### Models

The primary domain entities are:

```text
User
Role
Course
Subject
Assignment
Submission
```

### Services

The current service layer contains JWT token functionality:

```text
Services/
├── ITokenService.cs
└── TokenService.cs
```

### Settings

Application configuration classes include:

```text
Settings/
├── JwtSettings.cs
└── MongoDbSettings.cs
```

---

## 5. Frontend Architecture

The frontend uses the Next.js App Router with localized routing.

The main application routes are organized around the three user roles:

```text
[lang]/
└── (routes)/
    ├── admin/
    ├── student/
    └── teacher/
```

### Admin

```text
admin/
├── courses/
├── subjects/
├── teachers/
└── users/
```

### Student

```text
student/
├── assignments/
├── classmates/
├── grades/
└── subjects/
```

### Teacher

```text
teacher/
├── assignments/
├── colleagues/
├── courses/
├── students/
└── subjects/
```

Shared functionality is separated into reusable components, hooks, providers, and API utilities.

---

## 6. Installation & Local Setup

### Prerequisites

Install the following:

* Node.js LTS
* pnpm
* .NET 8 SDK
* MongoDB local instance or MongoDB Atlas

---

## 7. Backend Setup

From the repository root:

```cmd
cd backend
```

Restore the .NET dependencies:

```cmd
dotnet restore
```

Configure the backend using:

```text
backend/appsettings.json
```

Example configuration:

```json
{
  "ConnectionStrings": {
    "MongoDb": "your-mongodb-connection-string"
  },
  "CloudinarySettings": {
    "CloudName": "your-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret"
  },
  "JwtSettings": {
    "Secret": "your-fallback-jwt-secret-key-at-least-32-chars",
    "Issuer": "MulyayonIssuer",
    "Audience": "MulyayonAudience"
  }
}
```

Run the API:

```cmd
dotnet run
```

The exact HTTP/HTTPS ports are determined by the ASP.NET Core configuration and `Properties/launchSettings.json`.

Swagger is available through the configured Swagger endpoint, typically:

```text
https://localhost:<port>/swagger
```

---

## 8. Database Initialization

No manual MongoDB collection creation is required.

The backend contains:

```text
Data/DbSeeder.cs
```

which is responsible for initializing/seeding application data when the backend starts.

Seed data is also provided in:

```text
Data/student.json
Data/teacher.json
```

Make sure the configured MongoDB connection is accessible before starting the backend.

---

## 9. Frontend Setup

Open another terminal from the repository root:

```cmd
cd frontend
```

Install dependencies:

```cmd
pnpm install
```

Create:

```text
frontend/.env.local
```

and configure the backend API URL:

```env
NEXT_PUBLIC_API_URL=https://localhost:<backend-port>
```

Then start the development server:

```cmd
pnpm dev
```

The Next.js application will normally be available at:

```text
http://localhost:3000
```

---

## 10. Running Frontend & Backend Together

The system requires both applications to be running during local development.

### Terminal 1 — Backend

```cmd
cd backend
dotnet run
```

### Terminal 2 — Frontend

```cmd
cd frontend
pnpm dev
```

The request flow is:

```text
Browser
   │
   ▼
Next.js Frontend
   │
   │ HTTP/HTTPS API requests
   ▼
ASP.NET Core Web API
   │
   ▼
MongoDB
```

For upload-related operations, media can additionally be handled through the configured Cloudinary integration.

---

## 11. Demo / Test Credentials

The database seeder provides the following evaluator accounts:

| Role        | Email                    | Password      |
| ----------- | ------------------------ | ------------- |
| **Admin**   | `admin@school.com`       | `Admin@123`   |
| **Teacher** | `tony.stark@school.com`  | `Teacher@123` |
| **Student** | `nick.clone8@school.com` | `Student@123` |

> These credentials are intended for project demonstration/evaluation.

---

## 12. Authentication & Authorization

Authentication uses JWT tokens.

The general flow is:

```text
User Login
    ↓
AuthController
    ↓
Credentials Validation
    ↓
JWT Token Generation
    ↓
Frontend Authentication State
    ↓
Authenticated API Requests
    ↓
Role-Based Authorization
```

Access to Admin, Teacher, and Student functionality is controlled according to the authenticated user's role.

---

## 13. Assignment & Submission Workflow

The primary academic workflow is:

```text
Teacher
   │
   ├── Create Assignment
   │
   ├── Save Draft
   │
   └── Publish
         │
         ▼
      Student
         │
         ├── View Assignment
         │
         └── Submit Work
                │
                ▼
             Teacher
                │
                ├── Review
                ├── Assign Marks
                └── Provide Feedback
                       │
                       ▼
                    Student
                       │
                       └── View Result
```

---

## 14. Upstream Synchronization Workflow

If subsequent developments occur within the individual, standalone upstream repositories, those updates can be integrated into this consolidated repository.

To synchronize these changes, navigate to the `mulyayon-app` root directory and execute the corresponding commands.

### Integrating Frontend Updates

To retrieve and merge modifications from the standalone frontend repository:

```cmd
git subtree pull --prefix=frontend frontend-upstream main --squash
````

### Integrating Backend Updates

To retrieve and merge modifications from the standalone backend repository:

```cmd
git subtree pull --prefix=backend backend-upstream main --squash
```

### Publishing Changes to the Remote Repository

To upload the integrated updates to the remote combined repository on GitHub:

```cmd
git push origin main
```


---

## 15. Current Limitations

### Offline Document Processing

The application does not currently provide dedicated offline document parsing or text extraction for uploaded student files.

### Real-Time Notifications

Submission and grading status changes do not currently use a persistent WebSocket-based real-time notification system.

Users may need to refresh or navigate to see updated state.

---

## 16. Build & Production

### Frontend

Create a production build:

```cmd
cd frontend
pnpm build
```

Start the production server:

```cmd
pnpm start
```

### Backend

Build the ASP.NET Core application:

```cmd
cd backend
dotnet build
```

The repository also contains:

```text
backend/Dockerfile
```

for containerized backend deployment.

---

## 17. Repository Development Notes

The repository is maintained as a combined application:

```text
mulyayon-app/
├── frontend/
└── backend/
```

The frontend and backend can therefore be developed and versioned together while retaining clear separation between the client and API layers.

---

## 18. License

This project was developed as part of the Assistant Software Engineer Recruitment Project for OnnoRokom Projukti Limited.
