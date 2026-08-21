using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using Serilog;

namespace backend.Data;

public class StudentSeedDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
}

public class TeacherSeedDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<string> Specialties { get; set; } = new();
    public List<string> Versions { get; set; } = new();
    public List<string> Levels { get; set; } = new();
}

public static class DbSeeder
{
    private static string ResolveFilePath(string fileName)
    {
        var baseDir = AppDomain.CurrentDomain.BaseDirectory;
        var path = Path.Combine(baseDir, fileName);
        if (File.Exists(path)) return path;

        var sourceDir = Path.Combine(baseDir, "..", "..", "..", "Data", fileName);
        if (File.Exists(sourceDir)) return Path.GetFullPath(sourceDir);

        return path;
    }

    public static async Task SeedAsync(MongoDbContext context)
    {
        // 1. Seed Courses
        var courseCount = await context.Courses.CountDocumentsAsync(Builders<Course>.Filter.Empty);
        if (courseCount == 0)
        {
            var baseCourses = new List<(string Name, string NameBn, string Level)>
            {
                ("Class 1", "প্রথম শ্রেণী", "Primary"),
                ("Class 2", "দ্বিতীয় শ্রেণী", "Primary"),
                ("Class 3", "তৃতীয় শ্রেণী", "Primary"),
                ("Class 4", "চতুর্থ শ্রেণী", "Primary"),
                ("Class 5", "পঞ্চম শ্রেণী", "Primary"),
                ("Class 6", "ষষ্ঠ শ্রেণী", "Secondary"),
                ("Class 7", "সপ্তম শ্রেণী", "Secondary"),
                ("Class 8", "অষ্টম শ্রেণী", "Secondary"),
                
                // Class 9 Split into Groups
                ("Class 9 (Science)", "নবম শ্রেণী (বিজ্ঞান)", "Secondary"),
                ("Class 9 (Business Studies)", "নবম শ্রেণী (ব্যবসায় শিক্ষা)", "Secondary"),
                ("Class 9 (Humanities)", "নবম শ্রেণী (মানবিক)", "Secondary"),
                
                // Class 10 Groups
                ("Class 10 (Science - New)", "দশম শ্রেণী (বিজ্ঞান - নতুন)", "Secondary"),
                ("Class 10 (Science - Candidate)", "দশম শ্রেণী (বিজ্ঞান - পরীক্ষার্থী)", "Secondary"),
                ("Class 10 (Business Studies - New)", "দশম শ্রেণী (ব্যবসায় শিক্ষা - নতুন)", "Secondary"),
                ("Class 10 (Business Studies - Candidate)", "দশম শ্রেণী (ব্যবসায় শিক্ষা - পরীক্ষার্থী)", "Secondary"),
                ("Class 10 (Humanities - New)", "দশম শ্রেণী (মানবিক - নতুন)", "Secondary"),

                ("Class 11 (Science)", "একাদশ শ্রেণী (বিজ্ঞান)", "Higher Secondary"),
                ("Class 11 (Business Studies)", "একাদশ শ্রেণী (ব্যবসায় শিক্ষা)", "Higher Secondary"),
                ("Class 11 (Humanities)", "একাদশ শ্রেণী (মানবিক)", "Higher Secondary"),
                ("Class 12 (Science)", "দ্বাদশ শ্রেণী (বিজ্ঞান)", "Higher Secondary"),
                ("Class 12 (Business Studies)", "দ্বাদশ শ্রেণী (ব্যবসায় শিক্ষা)", "Higher Secondary"),
                ("Class 12 (Humanities)", "দ্বাদশ শ্রেণী (মানবিক)", "Higher Secondary")
            };

            var coursesToSeed = new List<Course>();
            int orderIndex = 1; // Keep track of academic progression

            foreach (var bc in baseCourses)
            {
                coursesToSeed.Add(new Course
                {
                    Name = $"{bc.Name} (BV)",
                    NameBn = $"{bc.NameBn} (বাংলা সংস্করণ)",
                    Level = bc.Level,
                    Version = "Bangla",
                    Order = orderIndex
                });

                coursesToSeed.Add(new Course
                {
                    Name = $"{bc.Name} (EV)",
                    NameBn = $"{bc.NameBn} (ইংরেজি সংস্করণ)",
                    Level = bc.Level,
                    Version = "English",
                    Order = orderIndex
                });
                orderIndex++;
            }
            await context.Courses.InsertManyAsync(coursesToSeed);
        }

        var allCourses = await context.Courses.Find(Builders<Course>.Filter.Empty).ToListAsync();

        // 2. Translation Dictionary
        var nameMap = new Dictionary<string, string>
        {
            { "Class 1", "প্রথম শ্রেণী" }, { "Class 2", "দ্বিতীয় শ্রেণী" }, { "Class 3", "তৃতীয় শ্রেণী" },
            { "Class 4", "চতুর্থ শ্রেণী" }, { "Class 5", "পঞ্চম শ্রেণী" }, { "Class 6", "ষষ্ঠ শ্রেণী" },
            { "Class 7", "সপ্তম শ্রেণী" }, { "Class 8", "অষ্টম শ্রেণী" }, { "Class 9", "নবম শ্রেণী" },
            { "Class 10", "দশম শ্রেণী" }, { "Class 11", "একাদশ শ্রেণী" }, { "Class 12", "দ্বাদশ শ্রেণী" },
            { "Bangla", "বাংলা" }, { "English", "ইংরেজি" }, { "Mathematics", "গণিত" },
            { "Science", "বিজ্ঞান" }, { "Elementary Science", "প্রাথমিক বিজ্ঞান" }, { "ICT", "তথ্য ও যোগাযোগ প্রযুক্তি" },
            { "Bangladesh & Global Studies", "বাংলাদেশ ও বিশ্বপরিচয়" }, { "Religion & Moral Education", "ধর্ম ও নৈতিক শিক্ষা" },
            { "Religion", "ধর্ম ও নৈতিক শিক্ষা" }, { "General Science", "সাধারণ বিজ্ঞান" },
            { "Physics", "পদার্থবিজ্ঞান" }, { "Chemistry", "রসায়ন" }, { "Biology", "জীববিজ্ঞান" },
            { "Higher Mathematics", "উচ্চতর গণিত" }, { "Accounting", "হিসাববিজ্ঞান" },
            { "Finance & Banking", "ফিন্যান্স ও ব্যাংকিং" }, { "Business Entrepreneurship", "ব্যবসায় উদ্যোগ" },
            { "History of Bangladesh & World Civilization", "বাংলাদেশ ও বিশ্বসভ্যতার ইতিহাস" },
            { "Geography & Environment", "ভূগোল ও পরিবেশ" }, { "Civics & Citizenship", "পৌরনীতি ও নাগরিকতা" },
            { "1st Paper", "১ম পত্র" }, { "2nd Paper", "২য় পত্র" },
            { "Business", "ব্যবসায়" }, { "Studies", "শিক্ষা" }, { "Humanities", "মানবিক" },
            { "Organization", "সংগঠন" }, { "Management", "ব্যবস্থাপনা" }, { "Finance", "ফিন্যান্স," }, 
            { "Banking", "ব্যাংকিং" }, { "Insurance", "বিমা" }, { "Production", "উৎপাদন" }, 
            { "Marketing", "বিপণন" }, { "Civics", "পৌরনীতি" }, { "Good", "সু" }, 
            { "Governance", "শাসন" }, { "Economics", "অর্থনীতি" }, { "Geography", "ভূগোল" }, 
            { "Logic", "যুক্তিবিদ্যা" }, { "&", "ও" }
        };

        // 3. Seed Subjects
        var subjectCount = await context.Subjects.CountDocumentsAsync(Builders<Subject>.Filter.Empty);
        if (subjectCount == 0)
        {
            var subjectsToSeed = new List<Subject>();

            foreach (var course in allCourses)
            {
                var isEv = course.Version == "English";
                var langSuffix = isEv ? " (EV)" : "";
                var bnSuffix = isEv ? " (ইংরেজি সংস্করণ)" : " (বাংলা সংস্করণ)";

                string GetBnName(string englishSubjectName)
                {
                    var bnBuilder = new System.Text.StringBuilder();
                    var cleanName = englishSubjectName.Replace(" (EV)", "").Replace(" (BV)", "");
                    var parts = cleanName.Split(' ');
                    
                    foreach (var part in parts)
                    {
                        var key = part.Trim();
                        if (nameMap.TryGetValue(key, out var value))
                        {
                            bnBuilder.Append(value + " ");
                        }
                        else if (nameMap.TryGetValue(key.Replace("(", "").Replace(")", ""), out var val2))
                        {
                            bnBuilder.Append(val2 + " ");
                        }
                        else
                        {
                            bnBuilder.Append(part + " ");
                        }
                    }
                    return bnBuilder.ToString().Trim() + bnSuffix;
                }

                void AddSubject(string enName)
                {
                    subjectsToSeed.Add(new Subject
                    {
                        Name = enName,
                        NameBn = GetBnName(enName),
                        CourseId = course.Id!
                    });
                }

                var baseName = course.Name.Replace(" (BV)", "").Replace(" (EV)", "");

                if (course.Level == "Primary")
                {
                    AddSubject($"{baseName} Bangla" + langSuffix);
                    AddSubject($"{baseName} English" + langSuffix);
                    AddSubject($"{baseName} Mathematics" + langSuffix);

                    if (!course.Name.Contains("Class 1") && !course.Name.Contains("Class 2"))
                    {
                        AddSubject($"{baseName} Elementary Science" + langSuffix);
                        AddSubject($"{baseName} Bangladesh & Global Studies" + langSuffix);
                        AddSubject($"{baseName} Religion & Moral Education" + langSuffix);
                    }
                }
                else if (course.Level == "Secondary" && !course.Name.Contains("Class 10") && !course.Name.Contains("Class 9"))
                {
                    AddSubject($"{baseName} Bangla" + langSuffix);
                    AddSubject($"{baseName} English" + langSuffix);
                    AddSubject($"{baseName} Mathematics" + langSuffix);
                    AddSubject($"{baseName} Science" + langSuffix);
                    AddSubject($"{baseName} Bangladesh & Global Studies" + langSuffix);
                    AddSubject($"{baseName} ICT" + langSuffix);
                    AddSubject($"{baseName} Religion" + langSuffix);
                }
                // Class 9 & Class 10 Science Groups
                else if (course.Name.Contains("Science") && (course.Name.Contains("Class 9") || course.Name.Contains("Class 10")))
                {
                    var prefix = course.Name.Contains("Class 9") ? "Class 9" : "Class 10";
                    AddSubject($"{prefix} Bangla 1st Paper" + langSuffix);
                    AddSubject($"{prefix} Bangla 2nd Paper" + langSuffix);
                    AddSubject($"{prefix} English 1st Paper" + langSuffix);
                    AddSubject($"{prefix} English 2nd Paper" + langSuffix);
                    AddSubject($"{prefix} Mathematics" + langSuffix);
                    AddSubject($"{prefix} ICT" + langSuffix);
                    AddSubject($"{prefix} Physics" + langSuffix);
                    AddSubject($"{prefix} Chemistry" + langSuffix);
                    AddSubject($"{prefix} Biology" + langSuffix);
                    AddSubject($"{prefix} Higher Mathematics" + langSuffix);
                }
                // Class 9 & Class 10 Business Studies Groups
                else if (course.Name.Contains("Business") && (course.Name.Contains("Class 9") || course.Name.Contains("Class 10")))
                {
                    var prefix = course.Name.Contains("Class 9") ? "Class 9" : "Class 10";
                    AddSubject($"{prefix} Bangla 1st Paper" + langSuffix);
                    AddSubject($"{prefix} Bangla 2nd Paper" + langSuffix);
                    AddSubject($"{prefix} English 1st Paper" + langSuffix);
                    AddSubject($"{prefix} English 2nd Paper" + langSuffix);
                    AddSubject($"{prefix} Mathematics" + langSuffix);
                    AddSubject($"{prefix} ICT" + langSuffix);
                    AddSubject($"{prefix} Accounting" + langSuffix);
                    AddSubject($"{prefix} Finance & Banking" + langSuffix);
                    AddSubject($"{prefix} Business Entrepreneurship" + langSuffix);
                }
                // Class 9 & Class 10 Humanities Groups
                else if (course.Name.Contains("Humanities") && (course.Name.Contains("Class 9") || course.Name.Contains("Class 10")))
                {
                    var prefix = course.Name.Contains("Class 9") ? "Class 9" : "Class 10";
                    AddSubject($"{prefix} Bangla 1st Paper" + langSuffix);
                    AddSubject($"{prefix} Bangla 2nd Paper" + langSuffix);
                    AddSubject($"{prefix} English 1st Paper" + langSuffix);
                    AddSubject($"{prefix} English 2nd Paper" + langSuffix);
                    AddSubject($"{prefix} Mathematics" + langSuffix);
                    AddSubject($"{prefix} ICT" + langSuffix);
                    AddSubject($"{prefix} History of Bangladesh & World Civilization" + langSuffix);
                    AddSubject($"{prefix} Geography & Environment" + langSuffix);
                    AddSubject($"{prefix} Civics & Citizenship" + langSuffix);
                }
                else if (course.Level == "Higher Secondary")
                {
                    AddSubject($"{baseName} Bangla 1st Paper" + langSuffix);
                    AddSubject($"{baseName} Bangla 2nd Paper" + langSuffix);
                    AddSubject($"{baseName} English 1st Paper" + langSuffix);
                    AddSubject($"{baseName} English 2nd Paper" + langSuffix);
                    AddSubject($"{baseName} ICT" + langSuffix);

                    if (course.Name.Contains("Science"))
                    {
                        AddSubject($"{baseName} Physics 1st Paper" + langSuffix);
                        AddSubject($"{baseName} Physics 2nd Paper" + langSuffix);
                        AddSubject($"{baseName} Chemistry 1st Paper" + langSuffix);
                        AddSubject($"{baseName} Chemistry 2nd Paper" + langSuffix);
                        AddSubject($"{baseName} Higher Mathematics 1st Paper" + langSuffix);
                        AddSubject($"{baseName} Higher Mathematics 2nd Paper" + langSuffix);
                        AddSubject($"{baseName} Biology 1st Paper" + langSuffix);
                        AddSubject($"{baseName} Biology 2nd Paper" + langSuffix);
                    }
                    else if (course.Name.Contains("Business Studies"))
                    {
                        AddSubject($"{baseName} Accounting 1st Paper" + langSuffix);
                        AddSubject($"{baseName} Accounting 2nd Paper" + langSuffix);
                        AddSubject($"{baseName} Business Organization & Management 1st Paper" + langSuffix);
                        AddSubject($"{baseName} Business Organization & Management 2nd Paper" + langSuffix);
                        AddSubject($"{baseName} Finance Banking & Insurance 1st Paper" + langSuffix);
                        AddSubject($"{baseName} Finance Banking & Insurance 2nd Paper" + langSuffix);
                        AddSubject($"{baseName} Production Management & Marketing 1st Paper" + langSuffix);
                        AddSubject($"{baseName} Production Management & Marketing 2nd Paper" + langSuffix);
                    }
                    else if (course.Name.Contains("Humanities"))
                    {
                        AddSubject($"{baseName} Civics & Good Governance 1st Paper" + langSuffix);
                        AddSubject($"{baseName} Civics & Good Governance 2nd Paper" + langSuffix);
                        AddSubject($"{baseName} Economics 1st Paper" + langSuffix);
                        AddSubject($"{baseName} Economics 2nd Paper" + langSuffix);
                        AddSubject($"{baseName} Geography 1st Paper" + langSuffix);
                        AddSubject($"{baseName} Geography 2nd Paper" + langSuffix);
                        AddSubject($"{baseName} Logic 1st Paper" + langSuffix);
                        AddSubject($"{baseName} Logic 2nd Paper" + langSuffix);
                    }
                }
            }
            await context.Subjects.InsertManyAsync(subjectsToSeed);
        }

        var allSubjects = await context.Subjects.Find(Builders<Subject>.Filter.Empty).ToListAsync();

        // 4. Ensure Demo Admin Credentials Exist
        var adminExists = await context.Users.CountDocumentsAsync(u => u.Email == "admin@school.com") > 0;
        if (!adminExists)
        {
            await context.Users.InsertOneAsync(new User
            {
                Name = "School Admin",
                Email = "admin@school.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = "Admin"
            });
            Log.Information("Demo Admin credentials verified.");
        }

        // 5. Seed Teachers
        var teacherCount = await context.Users.CountDocumentsAsync(u => u.Role == "Teacher" && u.Email != "teacher@school.com");
        var teacherFilePath = ResolveFilePath("teacher.json");
        List<TeacherSeedDto>? teacherDtos = null;

        if (teacherCount == 0)
        {
            if (File.Exists(teacherFilePath))
            {
                try
                {
                    var jsonString = await File.ReadAllTextAsync(teacherFilePath);
                    teacherDtos = JsonSerializer.Deserialize<List<TeacherSeedDto>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    Log.Information("Loaded teachers successfully from teacher.json");
                }
                catch (JsonException ex)
                {
                    Log.Error(ex, "JSON Syntax Error inside teacher.json. Falling back to programmatic teacher generation.");
                }
            }

            if (teacherDtos == null)
            {
                Log.Warning("teacher.json not found or corrupt. Generating 50 Marvel Teachers programmatically...");
                teacherDtos = GenerateFallbackTeachers();
            }

            var teachersToInsert = teacherDtos.Select(dto => new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Teacher@123"),
                Role = "Teacher",
                Specialties = dto.Specialties,
                Versions = dto.Versions,
                Levels = dto.Levels
            }).ToList();

            var demoTeacherExists = await context.Users.CountDocumentsAsync(u => u.Email == "teacher@school.com") > 0;
            if (!demoTeacherExists)
            {
                teachersToInsert.Add(new User
                {
                    Name = "John Teacher (Demo)",
                    Email = "teacher@school.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Teacher@123"),
                    Role = "Teacher"
                });

                teacherDtos.Add(new TeacherSeedDto
                {
                    Name = "John Teacher (Demo)",
                    Email = "teacher@school.com",
                    Specialties = new List<string> { "Bangla", "English", "Mathematics", "Science" },
                    Versions = new List<string> { "Bangla", "English" },
                    Levels = new List<string> { "Primary", "Secondary", "Higher Secondary" }
                });
            }

            await context.Users.InsertManyAsync(teachersToInsert);

            // Fetch active teachers, excluding the dummy/demo account as requested
            var savedTeachers = await context.Users
                .Find(u => u.Role == "Teacher" && u.Email != "teacher@school.com")
                .ToListAsync();

            // Track workload counts to distribute subjects evenly and fairly
            var teacherWorkloads = savedTeachers.ToDictionary(t => t.Id!, t => 0);
            var rand = new Random();

            foreach (var subject in allSubjects)
            {
                var parentCourse = allCourses.FirstOrDefault(c => c.Id == subject.CourseId);
                if (parentCourse == null) continue;

                var qualified = savedTeachers.Where(t =>
                {
                    var dto = teacherDtos.FirstOrDefault(d => d.Email.Equals(t.Email, StringComparison.OrdinalIgnoreCase));
                    if (dto == null) return false;

                    bool levelMatch = dto.Levels.Contains(parentCourse.Level);
                    bool versionMatch = dto.Versions.Contains(parentCourse.Version);
                    bool specMatch = dto.Specialties.Any(s => subject.Name.Contains(s, StringComparison.OrdinalIgnoreCase));

                    return levelMatch && versionMatch && specMatch;
                }).ToList();

                // Fallback to all saved teachers if strict filters yield zero candidates
                if (qualified.Count == 0)
                {
                    qualified = savedTeachers;
                }

                // Balance Workloads:
                // 1. Sort by current workload (ascending) so under-assigned teachers are picked first
                // 2. Randomize among equivalent workloads to preserve database variance
                var selected = qualified
                    .OrderBy(t => teacherWorkloads[t.Id!])
                    .ThenBy(_ => rand.Next())
                    .Take(3) // Assigns exactly 3 teachers per subject as requested
                    .Select(t => t.Id!)
                    .ToList();

                // Defend against boundary cases: Ensure we get exactly 3 teachers if available
                if (selected.Count < 3 && savedTeachers.Count >= 3)
                {
                    var extra = savedTeachers
                        .Where(t => !selected.Contains(t.Id!))
                        .OrderBy(t => teacherWorkloads[t.Id!])
                        .Take(3 - selected.Count)
                        .Select(t => t.Id!);
                    selected.AddRange(extra);
                }

                // Log workload counts
                foreach (var teacherId in selected)
                {
                    teacherWorkloads[teacherId]++;
                }

                await context.Subjects.UpdateOneAsync(
                    Builders<Subject>.Filter.Eq(s => s.Id, subject.Id),
                    Builders<Subject>.Update.Set("teacherIds", selected)
                );
            }
            Log.Information("Teachers mapped to Subjects successfully.");
        }

        // 6. Seed Students
        var studentCount = await context.Users.CountDocumentsAsync(u => u.Role == "Student" && u.Email != "student@school.com");
        var studentFilePath = ResolveFilePath("teacher.json"); // Using standard ResolveFilePath
        if (!File.Exists(studentFilePath))
        {
            studentFilePath = ResolveFilePath("student.json");
        }
        if (!File.Exists(studentFilePath))
        {
            studentFilePath = ResolveFilePath("students.json");
        }

        List<StudentSeedDto>? studentDtos = null;

        if (studentCount == 0)
        {
            if (File.Exists(studentFilePath))
            {
                try
                {
                    var jsonString = await File.ReadAllTextAsync(studentFilePath);
                    studentDtos = JsonSerializer.Deserialize<List<StudentSeedDto>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    Log.Information("Loaded students successfully from student.json");
                }
                catch (JsonException ex)
                {
                    Log.Error(ex, "JSON Syntax Error inside student.json. Falling back to programmatic student generation.");
                }
            }

            if (studentDtos == null)
            {
                Log.Warning("student.json not found or corrupt. Generating 400 Marvel Students programmatically...");
                studentDtos = GenerateFallbackStudents(allCourses);
            }

            var studentsToInsert = new List<User>();
            var rand = new Random();

            var demoStudentExists = await context.Users.CountDocumentsAsync(u => u.Email == "student@school.com") > 0;
            if (!demoStudentExists)
            {
                var targetCourse = allCourses.FirstOrDefault(c => c.Name.Equals("Class 10 (Science - Candidate) (BV)", StringComparison.OrdinalIgnoreCase)) ?? allCourses.FirstOrDefault();
                if (targetCourse != null)
                {
                    studentsToInsert.Add(new User
                    {
                        Name = "Alex Student (Demo)",
                        Email = "student@school.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                        Role = "Student",
                        CourseId = targetCourse.Id
                    });
                }
            }

            foreach (var course in allCourses)
            {
                var assignedDtos = studentDtos
                    .Where(d => d.CourseName.Equals(course.Name, StringComparison.OrdinalIgnoreCase))
                    .ToList();

                int count = assignedDtos.Count;
                for (int i = 0; i < Math.Max(10, count); i++)
                {
                    StudentSeedDto baseDto;
                    string finalName;
                    string finalEmail;

                    if (i < count)
                    {
                        baseDto = assignedDtos[i];
                        finalName = baseDto.Name;
                        finalEmail = baseDto.Email;
                    }
                    else
                    {
                        var template = assignedDtos.Count > 0 ? assignedDtos[rand.Next(assignedDtos.Count)] : studentDtos[rand.Next(studentDtos.Count)];
                        var nameParts = template.Name.Split(' ');
                        var baseName = nameParts.First();
                        var suffix = nameParts.Length > 1 ? string.Join(" ", nameParts.Skip(1)) : "Variant";

                        finalName = $"{baseName} ({suffix} Variant #{i + 1})";
                        finalEmail = $"{baseName.ToLower().Replace(".", "")}.clone{i + 1}@school.com";
                    }

                    studentsToInsert.Add(new User
                    {
                        Name = finalName,
                        Email = finalEmail,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                        Role = "Student",
                        CourseId = course.Id
                    });
                }
            }

            if (studentsToInsert.Any())
            {
                await context.Users.InsertManyAsync(studentsToInsert);
                Log.Information($"Successfully seeded {studentsToInsert.Count} students.");
            }
        }
    }

    private static List<TeacherSeedDto> GenerateFallbackTeachers()
    {
        var specialties = new List<string> { "Bangla", "English", "Mathematics", "Science", "Physics", "Chemistry", "Biology", "ICT", "Accounting", "Geography", "History" };
        var levels = new List<string> { "Primary", "Secondary", "Higher Secondary" };
        var versions = new List<string> { "Bangla", "English" };

        var firstNames = new[] { "Charles", "Tony", "Stephen", "Bruce", "Hank", "Otto", "Norman", "Reed", "Emma", "Loki", "Steve", "Natasha", "Clint", "Thor", "Wanda", "Matt", "Luke", "Danny", "Jessica", "Carol", "Susan", "Johnny", "Ben", "Jean", "Scott" };
        var lastNames = new[] { "Xavier", "Stark", "Strange", "Banner", "Pym", "Octavius", "Osborn", "Richards", "Frost", "Laufeyson", "Rogers", "Romanoff", "Barton", "Odinson", "Maximoff", "Murdock", "Cage", "Rand", "Jones", "Danvers", "Storm", "Grimm", "Grey", "Summers" };

        var generated = new List<TeacherSeedDto>();
        var rand = new Random();

        for (int i = 0; i < 50; i++)
        {
            var firstName = firstNames[i % firstNames.Length];
            var lastName = lastNames[(i + 5) % lastNames.Length];
            var baseName = $"{firstName} {lastName}";
            if (generated.Any(t => t.Name == baseName))
            {
                baseName = $"{baseName} #{i}";
            }

            generated.Add(new TeacherSeedDto
            {
                Name = baseName,
                Email = $"{firstName.ToLower()}.{lastName.ToLower()}{i}@school.com",
                Specialties = specialties.OrderBy(_ => rand.Next()).Take(3).ToList(),
                Levels = levels.OrderBy(_ => rand.Next()).Take(2).ToList(),
                Versions = versions.OrderBy(_ => rand.Next()).Take(2).ToList()
            });
        }
        return generated;
    }

    private static List<StudentSeedDto> GenerateFallbackStudents(List<Course> courses)
    {
        var firstNames = new[] { "Peter", "Gwen", "Miles", "Ned", "Harry", "Flash", "Mary", "Liz", "Betty", "Anya", "Kamala", "Bobby", "Kitty", "Jubilee", "Rogue", "Remy", "Piotr", "Illyana", "Sam", "Roberto", "Scott", "Jean", "Warren", "Hank", "Alex", "Lorna", "Billy", "Tommy", "Teddy", "David", "America", "Cassie", "Kate", "Eli", "Noh", "Laura", "Gabby", "Quentin", "Glob", "Hisako" };
        var lastNames = new[] { "Parker", "Stacy", "Morales", "Leeds", "Osborn", "Thompson", "Watson", "Allan", "Brant", "Corazon", "Khan", "Drake", "Pryde", "Lee", "Raven", "LeBeau", "Rasputin", "Rasputina", "Guthrie", "daCosta", "Summers", "Grey", "Worthington", "McCoy", "Dane", "Kaplan", "Shepherd", "Altman", "Alleyne", "Chavez", "Lang", "Bishop", "Bradley", "Kree", "Kinney", "Quire", "Herman", "Ichiki" };

        var generated = new List<StudentSeedDto>();
        var rand = new Random();
        int emailIdCounter = 1;

        foreach (var course in courses)
        {
            for (int i = 0; i < 10; i++)
            {
                var fName = firstNames[rand.Next(firstNames.Length)];
                var lName = lastNames[rand.Next(lastNames.Length)];
                var name = $"{fName} {lName}";

                generated.Add(new StudentSeedDto
                {
                    Name = name,
                    Email = $"{fName.ToLower()}.{lName.ToLower()}{emailIdCounter++}@school.com",
                    CourseName = course.Name
                });
            }
        }
        return generated;
    }
}