export interface Course {
  id: string
  name: string
  nameBn: string // Maps to [BsonElement("nameBn")]
  level: "Primary" | "Secondary" | string // Maps to [BsonElement("level")]
  version: "Bangla" | "English" | string // Maps to [BsonElement("version")]
  order: number
}

export interface Subject {
  id: string
  name: string
  nameBn: string // Maps to [BsonElement("nameBn")]
  courseId: string
  teacherIds: string[] // List of teacher ObjectIds
}

export interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Teacher" | "Student"
  courseId?: string | null
  specialties?: string[]
  versions?: string[]
  levels?: string[]
}

export interface Assignment {
  id: string
  title: string
  description: string
  deadline: string // UTC ISO String
  maxMarks: number
  isPublished: boolean
  attachmentUrl?: string | null // Maps to [BsonElement("attachmentUrl")]
  subjectId: string
  teacherId: string
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  submittedAt: string // UTC ISO String
  answer: string
  attachmentUrl?: string | null
  status: "Submitted" | "Graded" | "Pending" | "Rejected" | string
  marks?: number | null
  feedback?: string
}

export interface TeacherStats {
  totalClassesToTake: number
  totalStudentsInClasses: number
  assignments: {
    totalCreated: number
    submissionsReceived: number
    submissionsPending: number
    submissionsRejected: number
  }
  classPerformance: Record<string, number>
}

export interface DbStats {
  totalVersions: number
  totalSubjects: number
  totalCourses: number
  teachers: {
    total: number
    assigned: number
    unassigned: number
    byLevel: Record<string, number>
  }
  students: {
    total: number
    assigned: number
    unassigned: number
    byVersion: {
      BV: Record<string, number>
      EV: Record<string, number>
    }
  }
}

export interface HealthReport {
  status: "Healthy" | "Unhealthy"
  timestamp: string
  uptime: string
  services: {
    database: {
      status: string
      latencyMs: number
    }
    server: {
      status: "Healthy" | "Unhealthy"
    }
  }
}

export interface PublicStats {
  totalStudents: number
  totalTeachers: number
  totalCourses: number
  totalSubjects: number
}