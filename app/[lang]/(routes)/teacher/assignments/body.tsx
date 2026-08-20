"use client"

import * as React from "react"
import { useTeacherStudents, MySubjectResponse } from "@/hooks/teacher/use-teacher-students"
import { Submission } from "@/types/api"
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Edit, 
  ExternalLink, 
  Save, 
  BookOpen, 
  Plus, 
  X,
  FileText,
  Calendar
} from "lucide-react"
import { useAssignments } from "@/hooks/common/use-assignments"
import { useSubmissions } from "@/hooks/common/use-submissions"
import AddAssignmentForm, { CreateAssignmentPayload } from "@/components/forms/teacher/add-assignment-form"

interface BodyProps {
  locale: "en" | "bn"
}

const translations = {
  en: {
    addAssignment: "Create New Assignment",
    editAssignment: "Edit Assignment Details",
    updateAssignment: "Update Assignment",
    titleLabel: "Assignment Title",
    titlePlaceholder: "e.g., Newton's Laws Lab Report",
    descLabel: "Instructions / Description",
    descPlaceholder: "Provide guidelines and grading metrics...",
    deadlineLabel: "Due Deadline",
    maxMarksLabel: "Maximum Marks",
    subjectLabel: "Subject / Course",
    subjectPlaceholder: "-- Choose Subject --",
    publishLabel: "Publish Immediately (visible to students)",
    attachmentLabel: "Attachment Worksheet / Link (Optional)",
    attachmentPlaceholder: "e.g., https://drive.google.com/worksheet.pdf",
    cancel: "Cancel",
    toggleCreate: "Create Assignment",
    alertSuccess: "Assignment created successfully!",
    alertUpdateSuccess: "Assignment details updated successfully!",
    refTitle: "Assignment Reference",
    refNoDesc: "No description provided for this assignment."
  },
  bn: {
    addAssignment: "নতুন অ্যাসাইনমেন্ট তৈরি করুন",
    editAssignment: "অ্যাসাইনমেন্ট সংশোধন করুন",
    updateAssignment: "অ্যাসাইনমেন্ট আপডেট করুন",
    titleLabel: "অ্যাসাইনমেন্ট শিরোনাম",
    titlePlaceholder: "যেমন: নিউটনের গতিসূত্রের ল্যাব রিপোর্ট",
    descLabel: "নির্দেশনা / বিবরণ",
    descPlaceholder: "মূল্যায়ন নির্দেশিকা এবং বর্ণনা লিখুন...",
    deadlineLabel: "জমার শেষ সময়",
    maxMarksLabel: "সর্বোচ্চ নম্বর",
    subjectLabel: "বিষয় / কোর্স",
    subjectPlaceholder: "-- বিষয় নির্বাচন করুন --",
    publishLabel: "অবিলম্বে প্রকাশ করুন (শিক্ষার্থীদের জন্য দৃশ্যমান)",
    attachmentLabel: "অ্যাসাইনমেন্ট ফাইল / লিংক (ঐচ্ছিক)",
    attachmentPlaceholder: "যেমন: https://drive.google.com/worksheet.pdf",
    cancel: "বাতিল করুন",
    toggleCreate: "অ্যাসাইনমেন্ট তৈরি",
    alertSuccess: "অ্যাসাইনমেন্টটি সফলভাবে তৈরি করা হয়েছে!",
    alertUpdateSuccess: "অ্যাসাইনমেন্টটি সফলভাবে আপডেট করা হয়েছে!",
    refTitle: "অ্যাসাইনমেন্ট তথ্য",
    refNoDesc: "এই অ্যাসাইনমেন্টের জন্য কোনো বিবরণ দেওয়া হয়নি।"
  }
}

export default function Body({ locale }: BodyProps) {
  const t = translations[locale]
  
  const { assignments, loading: assignmentsLoading, error: assignmentsError, refresh: refreshAssignments, createAssignment, updateAssignment } = useAssignments()
  const { getAssignmentSubmissions, gradeSubmission, loading: submissionsLoading, error: submissionsError } = useSubmissions()
  const { getMySubjects } = useTeacherStudents()

  // Form Mode: 'create' or 'edit'
  const [formMode, setFormMode] = React.useState<"create" | "edit" | null>(null)
  const [mySubjects, setMySubjects] = React.useState<MySubjectResponse[]>([])

  const [selectedAssignmentId, setSelectedSubmissionAssignmentId] = React.useState<string>("")
  const [submissions, setSubmissions] = React.useState<Submission[]>([])
  const [filter, setFilter] = React.useState<"All" | "Submitted" | "Graded">("All")
  const [search, setSearch] = React.useState("")
  
  // Grading Panel State
  const [selectedSubmission, setSelectedSubmission] = React.useState<Submission | null>(null)
  const [gradeMarks, setGradeMarks] = React.useState<number>(0)
  const [gradeFeedback, setGradeFeedback] = React.useState<string>("")

  // Fetch only the teacher's authorized subjects
  const fetchMySubjectsList = React.useCallback(async () => {
    try {
      const res = await getMySubjects(1, 50)
      if (res) {
        setMySubjects(res.data)
      }
    } catch {
      // Handled silently
    }
  }, [getMySubjects])

  // Fetch submissions dynamically when selected assignment changes
  const loadSubmissions = React.useCallback(async () => {
    if (!selectedAssignmentId) {
      setSubmissions([])
      return
    }
    const data = await getAssignmentSubmissions(selectedAssignmentId)
    if (data) {
      setSubmissions(data)
    }
  }, [selectedAssignmentId, getAssignmentSubmissions])

  React.useEffect(() => {
    let isMounted = true

    const timer = setTimeout(() => {
      if (isMounted) {
        fetchMySubjectsList()
        loadSubmissions()
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [fetchMySubjectsList, loadSubmissions])

  const activeAssignment = assignments.find((a) => a.id === selectedAssignmentId)

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesFilter = filter === "All" || sub.status === filter
    const matchesSearch = 
      sub.studentId.toLowerCase().includes(search.toLowerCase()) ||
      sub.answer.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleOpenGrading = (sub: Submission) => {
    setSelectedSubmission(sub)
    setGradeMarks(sub.marks || 0)
    setGradeFeedback(sub.feedback || "")
  }

  // Handle Form Submission for BOTH Create and Edit Modes
  const handleAssignmentFormSubmit = async (payload: CreateAssignmentPayload) => {
    if (formMode === "edit" && activeAssignment) {
      // Execute live PATCH API
      await updateAssignment(activeAssignment.id, payload)
      setFormMode(null)
      refreshAssignments()
      alert(t.alertUpdateSuccess)
    } else {
      // Execute live POST API
      await createAssignment(payload)
      setFormMode(null)
      refreshAssignments()
      alert(t.alertSuccess)
    }
  }

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubmission) return

    try {
      await gradeSubmission(selectedSubmission.id!, gradeMarks, gradeFeedback)
      setSubmissions((prev) => 
        prev.map((sub) => 
          sub.id === selectedSubmission.id 
            ? { ...sub, marks: gradeMarks, feedback: gradeFeedback, status: "Graded" } 
            : sub
        )
      )
      setSelectedSubmission(null)
    } catch {
      // Handled by hooks
    }
  }

  const isPageLoading = assignmentsLoading || submissionsLoading

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Header and Toggle Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Grading & Submissions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review, evaluate, and provide grade metrics for active homework submissions.
          </p>
        </div>

        <button
          onClick={() => setFormMode((prev) => prev ? null : "create")}
          className="self-start sm:self-auto flex items-center justify-center h-9 px-4 text-xs font-bold border rounded-lg hover:bg-accent transition-colors gap-1.5 cursor-pointer"
        >
          {formMode ? (
            <>
              <X className="h-3.5 w-3.5" />
              {t.cancel}
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              {t.toggleCreate}
            </>
          )}
        </button>
      </div>

      {/* Reusable Form Instance in BOTH modes (Create / Edit) */}
      {formMode && (
        <AddAssignmentForm
          onSubmit={handleAssignmentFormSubmit}
          isSubmitting={isPageLoading}
          subjects={mySubjects}
          initialData={formMode === "edit" ? activeAssignment : null} // Pre-populates if edit
          t={t}
        />
      )}

      {assignmentsError && (
        <div className="p-4 border rounded-lg bg-destructive/5 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {assignmentsError}
        </div>
      )}

      {/* Directory Selectors */}
      <div className="grid gap-4 md:grid-cols-3 items-end">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" /> Select Assignment to Grade:
          </label>
          <select
            value={selectedAssignmentId}
            onChange={(e) => {
              setSelectedSubmissionAssignmentId(e.target.value)
              setSelectedSubmission(null)
              setFormMode(null) // Reset form mode on active selector change
            }}
            className="w-full h-10 px-3 text-xs border rounded-lg outline-none bg-background focus:border-slate-400"
          >
            <option value="">-- Choose Assignment --</option>
            {assignments.map((as) => (
              <option key={as.id} value={as.id}>
                {as.title} (Max Marks: {as.maxMarks})
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student ID..."
            className="w-full h-10 pl-9 pr-4 text-xs border rounded-lg bg-background shadow-sm outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Dynamic Reference Box (With Description, Link, and Edit/Update Control) */}
      {activeAssignment && (
        <div className="p-5 border border-blue-100 bg-blue-50/20 rounded-xl space-y-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b pb-1.5 gap-4">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 min-w-0">
              <FileText className="h-4.5 w-4.5 text-blue-900 shrink-0" />
              <span className="truncate">{t.refTitle}: {activeAssignment.title}</span>
            </div>
            
            {/* Edit Trigger Action Button */}
            <button
              onClick={() => setFormMode("edit")}
              className="flex items-center justify-center gap-1 h-7 px-2.5 text-[10px] font-bold border rounded bg-background hover:bg-accent text-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5" /> {locale === "bn" ? "অ্যাসাইনমেন্ট পরিবর্তন" : "Edit Assignment"}
            </button>
          </div>
          
          <div className="space-y-1">
            <span className="font-bold text-slate-800">Instructions:</span>
            <p className="text-slate-600 leading-relaxed">
              {activeAssignment.description || t.refNoDesc}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-100/50">
            {/* Deadline */}
            <div className="flex items-center gap-1.5 text-slate-700">
              <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
              <span className="font-bold">Deadline:</span>
              <span>{new Date(activeAssignment.deadline).toLocaleString()}</span>
            </div>

            {/* Attachment */}
            {activeAssignment.attachmentUrl && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800">Attachment:</span>
                <a 
                  href={activeAssignment.attachmentUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-blue-700 hover:text-blue-900 font-bold underline flex items-center gap-1 truncate"
                >
                  Open Link <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedAssignmentId && (
        <div className="flex flex-wrap gap-1.5 p-1 border rounded-lg bg-muted/40 self-start w-fit">
          {(["All", "Submitted", "Graded"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filter === tab 
                  ? "bg-background shadow-sm text-slate-900" 
                  : "text-muted-foreground hover:text-slate-900"
              }`}
            >
              {tab === "All" && "All Submissions"}
              {tab === "Submitted" && "Pending Evaluation"}
              {tab === "Graded" && "Graded"}
            </button>
          ))}
        </div>
      )}

      {/* Workspace Grid */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 border rounded-xl bg-background shadow-sm overflow-hidden divide-y divide-slate-100">
          {isPageLoading && (
            <div className="p-6 text-center text-muted-foreground animate-pulse">Loading homework pipeline...</div>
          )}

          {!selectedAssignmentId && (
            <div className="p-12 text-center text-muted-foreground">
              Please choose an assignment from the dropdown above to view submissions.
            </div>
          )}

          {selectedAssignmentId && !isPageLoading && filteredSubmissions.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No matching student submissions found for this assignment.
            </div>
          )}

          {selectedAssignmentId && !isPageLoading && filteredSubmissions.map((sub) => (
            <div key={sub.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">Student ID: {sub.studentId}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : ""}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {sub.status !== "Graded" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="h-3 w-3" /> Pending Evaluation
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> Graded ({sub.marks}/{activeAssignment?.maxMarks || 100})
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleOpenGrading(sub)}
                className="flex items-center justify-center gap-1 px-3 h-8 text-xs font-bold border rounded-lg bg-background hover:bg-accent text-slate-800 transition-colors shrink-0"
              >
                <Edit className="h-3.5 w-3.5" /> Grade
              </button>
            </div>
          ))}
        </div>

        <div className="p-5 sm:p-6 border rounded-xl bg-background shadow-sm space-y-4">
          {submissionsError && (
            <div className="p-2 border rounded bg-red-50 text-red-700 text-xs flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> {submissionsError}
            </div>
          )}

          {selectedSubmission ? (
            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <h3 className="text-md font-bold text-slate-900">Grading Workspace</h3>
                <p className="text-[10px] text-muted-foreground">Evaluating Student ID: {selectedSubmission.studentId}</p>
              </div>

              <div className="p-3 border rounded-lg bg-slate-50 text-xs text-slate-700 leading-relaxed max-h-40 overflow-y-auto">
                <span className="font-bold text-slate-900 block mb-1">Student Answer:</span>
                &quot;{selectedSubmission.answer}&quot;
              </div>

              {selectedSubmission.attachmentUrl && (
                <div className="flex items-center justify-between p-2 border border-blue-100 bg-blue-50/50 rounded-lg text-xs">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5 truncate">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    Homework_Submission_File
                  </span>
                  <a 
                    href={selectedSubmission.attachmentUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-700 hover:text-blue-900 p-1 shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              <div className="space-y-3 pt-3 border-t">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Score (Out of {activeAssignment?.maxMarks || 100}):
                  </label>
                  <input
                    type="number"
                    max={activeAssignment?.maxMarks || 100}
                    min={0}
                    value={gradeMarks}
                    onChange={(e) => setGradeMarks(Number(e.target.value))}
                    className="w-full h-9 px-3 text-xs border rounded-lg outline-none focus:border-slate-400 bg-background"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Teacher Feedback:</label>
                  <textarea
                    rows={3}
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    placeholder="Enter analytical review notes..."
                    className="w-full p-3 text-xs border rounded-lg outline-none bg-background focus:border-slate-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPageLoading}
                  className="w-full h-9 bg-blue-950 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> Save Evaluation Metrics
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[25vh]">
              <AlertCircle className="h-6 w-6 mb-2 text-muted-foreground/50" />
              <p className="text-xs">Select any student submission from the left table to start evaluating and managing grades.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}