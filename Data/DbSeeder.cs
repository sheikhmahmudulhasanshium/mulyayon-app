using backend.Models;
using MongoDB.Driver;
using Serilog;

namespace backend.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(MongoDbContext context)
    {
        // 1. Seed Courses (Programmatically generates both BV and EV for all classes)
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
                ("Class 9", "নবম শ্রেণী", "Secondary"),
                
                // Class 10 Splits (New vs Candidate)
                ("Class 10 (Science - New)", "দশম শ্রেণী (বিজ্ঞান - নতুন)", "Secondary"),
                ("Class 10 (Science - Candidate)", "দশম শ্রেণী (বিজ্ঞান - পরীক্ষার্থী)", "Secondary"),
                ("Class 10 (Business Studies - New)", "দশম শ্রেণী (ব্যবসায় শিক্ষা - নতুন)", "Secondary"),
                ("Class 10 (Business Studies - Candidate)", "দশম শ্রেণী (ব্যবসায় শিক্ষা - পরীক্ষার্থী)", "Secondary"),
                ("Class 10 (Humanities - New)", "দশম শ্রেণী (মানবিক - নতুন)", "Secondary"),

                // Higher Secondary
                ("Class 11 (Science)", "একাদশ শ্রেণী (বিজ্ঞান)", "Higher Secondary"),
                ("Class 12 (Science)", "দ্বাদশ শ্রেণী (বিজ্ঞান)", "Higher Secondary")
            };

            var coursesToSeed = new List<Course>();

            foreach (var bc in baseCourses)
            {
                // Generate Bangla Version (BV)
                coursesToSeed.Add(new Course
                {
                    Name = $"{bc.Name} (BV)",
                    NameBn = $"{bc.NameBn} (বাংলা সংস্করণ)",
                    Level = bc.Level,
                    Version = "Bangla"
                });

                // Generate English Version (EV)
                coursesToSeed.Add(new Course
                {
                    Name = $"{bc.Name} (EV)",
                    NameBn = $"{bc.NameBn} (ইংরেজি সংস্করণ)",
                    Level = bc.Level,
                    Version = "English"
                });
            }

            await context.Courses.InsertManyAsync(coursesToSeed);
        }

        var allCourses = await context.Courses.Find(Builders<Course>.Filter.Empty).ToListAsync();

        // 2. Helper Translation Dictionary for Subjects
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
            { "1st Paper", "১ম পত্র" }, { "2nd Paper", "২য় পত্র" }
        };

        // 3. Seed Subjects (NCTB Aligned, mapped dynamically for BV & EV)
        var subjectCount = await context.Subjects.CountDocumentsAsync(Builders<Subject>.Filter.Empty);
        if (subjectCount == 0)
        {
            var subjectsToSeed = new List<Subject>();

            foreach (var course in allCourses)
            {
                var isEv = course.Version == "English";
                var langSuffix = isEv ? " (EV)" : "";
                var bnSuffix = isEv ? " (ইংরেজি সংস্করণ)" : " (বাংলা সংস্করণ)";

                // Helper method to dynamically translate subject names to Bangla script
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
                            bnBuilder.Append(part + " "); // Fallback if no translation found
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

                // Parse base class name to split subjects properly
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
                else if (course.Name.Contains("Class 9"))
                {
                    AddSubject("Class 9 Bangla 1st Paper" + langSuffix);
                    AddSubject("Class 9 Bangla 2nd Paper" + langSuffix);
                    AddSubject("Class 9 English 1st Paper" + langSuffix);
                    AddSubject("Class 9 English 2nd Paper" + langSuffix);
                    AddSubject("Class 9 Mathematics" + langSuffix);
                    AddSubject("Class 9 ICT" + langSuffix);
                    AddSubject("Class 9 General Science" + langSuffix);
                }
                else if (course.Name.Contains("Class 10 (Science"))
                {
                    AddSubject("Class 10 Bangla 1st Paper" + langSuffix);
                    AddSubject("Class 10 Bangla 2nd Paper" + langSuffix);
                    AddSubject("Class 10 English 1st Paper" + langSuffix);
                    AddSubject("Class 10 English 2nd Paper" + langSuffix);
                    AddSubject("Class 10 Mathematics" + langSuffix);
                    AddSubject("Class 10 ICT" + langSuffix);
                    
                    AddSubject("Class 10 Physics" + langSuffix);
                    AddSubject("Class 10 Chemistry" + langSuffix);
                    AddSubject("Class 10 Biology" + langSuffix);
                    AddSubject("Class 10 Higher Mathematics" + langSuffix);
                }
                else if (course.Name.Contains("Class 10 (Business"))
                {
                    AddSubject("Class 10 Bangla 1st Paper" + langSuffix);
                    AddSubject("Class 10 Bangla 2nd Paper" + langSuffix);
                    AddSubject("Class 10 English 1st Paper" + langSuffix);
                    AddSubject("Class 10 English 2nd Paper" + langSuffix);
                    AddSubject("Class 10 Mathematics" + langSuffix);
                    AddSubject("Class 10 ICT" + langSuffix);

                    AddSubject("Class 10 Accounting" + langSuffix);
                    AddSubject("Class 10 Finance & Banking" + langSuffix);
                    AddSubject("Class 10 Business Entrepreneurship" + langSuffix);
                }
                else if (course.Name.Contains("Class 10 (Humanities"))
                {
                    AddSubject("Class 10 Bangla 1st Paper" + langSuffix);
                    AddSubject("Class 10 Bangla 2nd Paper" + langSuffix);
                    AddSubject("Class 10 English 1st Paper" + langSuffix);
                    AddSubject("Class 10 English 2nd Paper" + langSuffix);
                    AddSubject("Class 10 Mathematics" + langSuffix);
                    AddSubject("Class 10 ICT" + langSuffix);

                    AddSubject("Class 10 History of Bangladesh & World Civilization" + langSuffix);
                    AddSubject("Class 10 Geography & Environment" + langSuffix);
                    AddSubject("Class 10 Civics & Citizenship" + langSuffix);
                }
                else if (course.Level == "Higher Secondary")
                {
                    AddSubject($"{baseName} Bangla 1st Paper" + langSuffix);
                    AddSubject($"{baseName} Bangla 2nd Paper" + langSuffix);
                    AddSubject($"{baseName} English 1st Paper" + langSuffix);
                    AddSubject($"{baseName} English 2nd Paper" + langSuffix);
                    AddSubject($"{baseName} ICT" + langSuffix);

                    AddSubject($"{baseName} Physics 1st Paper" + langSuffix);
                    AddSubject($"{baseName} Physics 2nd Paper" + langSuffix);
                    AddSubject($"{baseName} Chemistry 1st Paper" + langSuffix);
                    AddSubject($"{baseName} Chemistry 2nd Paper" + langSuffix);
                    AddSubject($"{baseName} Higher Mathematics 1st Paper" + langSuffix);
                    AddSubject($"{baseName} Higher Mathematics 2nd Paper" + langSuffix);
                    AddSubject($"{baseName} Biology 1st Paper" + langSuffix);
                    AddSubject($"{baseName} Biology 2nd Paper" + langSuffix);
                }
            }

            await context.Subjects.InsertManyAsync(subjectsToSeed);
        }

        // 4. Seed Default Users
        var userCount = await context.Users.CountDocumentsAsync(Builders<User>.Filter.Empty);
        if (userCount == 0)
        {
            var scienceCandidateClass = allCourses.First(c => c.Name == "Class 10 (Science - Candidate) (BV)");

            var users = new List<User>
            {
                new User
                {
                    Name = "School Admin",
                    Email = "admin@school.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = Role.Admin
                },
                new User
                {
                    Name = "John Teacher",
                    Email = "teacher@school.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Teacher@123"),
                    Role = Role.Teacher
                },
                new User
                {
                    Name = "Alex Student",
                    Email = "student@school.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    Role = Role.Student,
                    CourseId = scienceCandidateClass.Id
                }
            };

            await context.Users.InsertManyAsync(users);
            Log.Information("3-users-added-----id:system-----type:seed-engine");
        }
    }
}