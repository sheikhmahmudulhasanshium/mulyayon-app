
<p align="center">
  <img src="https://raw.githubusercontent.com/sheikhmahmudulhasanshium/mulyayon-app/refs/heads/main/frontend/public/logo/logo-bn.png" alt="Mulyayon App Logo" width="200"/>
</p>



# Mulyayon App

This repository functions as a consolidated monorepo housing both the frontend and backend services for the Mulyayon application.

---

## 1. Repository Structure

This repository is structured to manage the complete application codebase in one location while preserving individual deployment pipelines:

*   **Parent Consolidated Repository:** [mulyayon-app](https://github.com/sheikhmahmudulhasanshium/mulyayon-app)
*   **Frontend Source Directory:** `/frontend` (Originated from [onno-rokom-frontend](https://github.com/sheikhmahmudulhasanshium/onno-rokom-frontend))
*   **Backend Source Directory:** `/backend` (Originated from [onno-rokom-backend](https://github.com/sheikhmahmudulhasanshium/onno-rokom-backend))

---

## 2. Live Deployments

*   **Frontend Service:** [https://mulyayon.vercel.app/](https://mulyayon.vercel.app/)
*   **Backend API Documentation:** [https://onno-rokom-backend.onrender.com/index.html](https://onno-rokom-backend.onrender.com/index.html)

---

## 3. Technology Stack

### Frontend
The user interface is built using React 19, Next.js, and TypeScript, managed with the `pnpm` package manager.

*   **Core Framework:** Next.js (v16.3.1), React (v19.2.8), TypeScript (v5.9.3)
*   **Styling:** Tailwind CSS (v4.3.3), `@tailwindcss/postcss`, `class-variance-authority`, `tailwind-merge`
*   **UI Components:** `shadcn`, `@base-ui/react`, `lucide-react` (icons)
*   **State & Forms:** `react-hook-form` with `zod` schema validation, `@hookform/resolvers`

### Backend
The server-side API is built on the .NET 8 framework, utilizing MongoDB as the primary database and Cloudinary for media storage.

*   **Runtime Environment:** .NET 8.0 (net8.0)
*   **Database Driver:** `MongoDB.Driver` (v3.11.0)
*   **Media Storage Solution:** `CloudinaryDotNet` (v1.29.3) (Used for direct media upload and asset management)
*   **Authentication:** `Microsoft.AspNetCore.Authentication.JwtBearer` & `System.IdentityModel.Tokens.Jwt`
*   **Logging:** `Serilog.AspNetCore` (v10.0.0)
*   **API Documentation:** `Swashbuckle.AspNetCore` (v6.6.2) for Swagger UI generation
*   **Security:** `BCrypt.Net-Next` (v4.2.0) for secure password hashing

---

## 4. Installation and Local Setup

To run this application locally, ensure you have the following prerequisites installed on your system:
*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [pnpm](https://pnpm.io/installation) package manager
*   [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
*   [MongoDB](https://www.mongodb.com/) (Local instance or Atlas connection string)

### Frontend Setup

1. Navigate to the frontend directory:
   ```cmd
   cd frontend
   ```
2. Install the required dependencies:
   ```cmd
   pnpm install
   ```
3. Create a `.env.local` file in the root of the `/frontend` directory and add your required configuration environment variables.
4. Start the local development server:
   ```cmd
   pnpm dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```cmd
   cd backend
   ```
2. Restore the NuGet package dependencies:
   ```cmd
   dotnet restore
   ```
3. Update the `appsettings.json` file with your configuration values (MongoDB connection strings, JWT keys, and Cloudinary API credentials):
   ```json
   {
     "MongoDbSettings": {
       "ConnectionString": "your-mongodb-connection-string",
       "DatabaseName": "your-database-name"
     },
     "CloudinarySettings": {
       "CloudName": "your-cloud-name",
       "ApiKey": "your-api-key",
       "ApiSecret": "your-api-secret"
     }
   }
   ```
4. Build and run the web API service:
   ```cmd
   dotnet run
   ```

---

## 5. Limitations

*   **[Placeholder for Limitation 1]** (e.g., Description of any rate limits, system constraints, or environment differences between local and production deployments).
*   **[Placeholder for Limitation 2]** (e.g., Media size upload limitations configured within the Cloudinary pipeline).
*   **[Placeholder for Limitation 3]** (e.g., Known platform compatibility notes or browser support boundaries).

---

## 6. Upstream Synchronization Workflow

If subsequent developments occur within the individual, standalone upstream repositories, those updates can be integrated into this consolidated repository. To synchronize these changes, navigate to the `mulyayon-app` root directory and execute the corresponding commands:

### Integrating Frontend Updates
To retrieve and merge modifications from the standalone frontend repository:
```cmd
git subtree pull --prefix=frontend frontend-upstream main --squash
```

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