# 1. Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the csproj file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the code and build the application
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# 2. Use the runtime-only image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Bypasses Linux kernel inotify limits by switching file monitoring to polling (Fixes Render startup crash)
ENV DOTNET_USE_POLLING_FILE_WATCHER=1

# Render dynamically injects a PORT environment variable (usually 10000). 
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "backend.dll"]