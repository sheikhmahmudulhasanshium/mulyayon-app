"use client"

import * as React from "react"
import { Search, Clock, CheckCircle2, XCircle, AlertCircle, Edit, ExternalLink, Save } from "lucide-react"

// Types matching your database Submission schema + useful UI extensions
export interface ExtendedSubmission {
  id: string
  assignmentId: string
  assignmentTitle: string
  studentId: string
  studentName: string
  submittedAt: string
  answer: string
  attachmentUrl?: string
  marks?: number
  maxMarks: number
  feedback?: string
  status: "Pending" | "Graded" | "Rejected"
}

export default function Body() {
  const [loading, setLoading] = React.useState(false)
  const [submissions, setSubmissions] = React.useState<ExtendedSubmission[]>([])
  const [filter, setFilter] = React.useState<"All" | "Pending" | "Graded" | "Rejected">("All")
  const [search, setSearch] = React.useState("")
  
  // Grading Modal/Panel State
  const [selectedSubmission, setSelectedSubmission] = React.useState<ExtendedSubmission | null>(null)
  const [gradeMarks, setGradeMarks] = React.useState<number>(0)
  const [gradeFeedback, setGradeFeedback] = React.useState<string>("")
  const [gradingStatus, setGradingStatus] = React.useState<"Graded" | "Rejected">("Graded")

  // Mock loader conforming to the pnpm timeout standards
  const fetchSubmissions = React.useCallback(async () => {
    setLoading(true)
    try {
      // Mock submissions mapped to standard seeder profiles
      const mockData: ExtendedSubmission[] = [
        {
          id: "sub_01",
          assignmentId: "as_101",
          assignmentTitle: "Class 10 Physics - Newton's Second Law Lab Work",
          studentId: "st_901",
          studentName: "Peter Parker",
          submittedAt: "2023-11-20T10:15:00Z",
          answer: "I calculated the acceleration of the mass by measuring the time it took to pass between two light gates. F=ma was verified within an experimental error margin of 2.4%.",
          attachmentUrl: "/mock-documents/lab_peter.pdf",
          maxMarks: 100,
          status: "Pending"
        },
        {
          id: "sub_02",
          assignmentId: "as_102",
          assignmentTitle: "Class 10 Chemistry - Periodic Table Characteristics",
          studentId: "st_902",
          studentName: "Gwen Stacy",
          submittedAt: "2023-11-19T14:30:00Z",
          answer: "Halogens are highly reactive nonmetals that form acidic compounds with hydrogen. Nobel gases have closed outer electron shells which makes them completely inert.",
          maxMarks: 50,
          marks: 48,
          feedback: "Flawless explanation of chemical groupings. Keep it up!",
          status: "Graded"
        },
        {
          id: "sub_03",
          assignmentId: "as_103",
          assignmentTitle: "Class 10 ICT - HTML Table Structures",
          studentId: "st_903",
          studentName: "Miles Morales",
          submittedAt: "2023-11-18T09:00:00Z",
          answer: "Below is my code... (incomplete snippet)",
          maxMarks: 20,
          marks: 0,
          feedback: "The submitted code was incomplete and missing key structural tags. Please review and resubmit.",
          status: "Rejected"
        }
      ]
      setSubmissions(mockData)
    } catch {
      // Graceful error fallback
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    let isMounted = true

    const timer = setTimeout(() => {
      if (isMounted) {
        fetchSubmissions()
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [fetchSubmissions])

  // Filters and queries
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesFilter = filter === "All" || sub.status === filter
    const matchesSearch = 
      sub.studentName.toLowerCase().includes(search.toLowerCase()) ||
      sub.assignmentTitle.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Open grading panel
  const handleOpenGrading = (sub: ExtendedSubmission) => {
    setSelectedSubmission(sub)
    setGradeMarks(sub.marks || 0)
    setGradeFeedback(sub.feedback || "")
    setGradingStatus(sub.status === "Pending" ? "Graded" : sub.status as "Graded" | "Rejected")
  }

  // Submit Grade simulation
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubmission) return

    setSubmissions((prev) => 
      prev.map((sub) => 
        sub.id === selectedSubmission.id 
          ? { 
              ...sub, 
              marks: gradeMarks, 
              feedback: gradeFeedback, 
              status: gradingStatus 
            } 
          : sub
      )
    )
    setSelectedSubmission(null)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Grading & Submissions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review, evaluate, and provide grade metrics for active homework submissions.
        </p>
      </div>

      {/* Directory Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 border rounded-lg bg-muted/40 self-start">
          {(["All", "Pending", "Graded", "Rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filter === tab 
                  ? "bg-background shadow-sm text-slate-900" 
                  : "text-muted-foreground hover:text-slate-900"
              }`}
            >
              {tab === "All" && "All Submissions"}
              {tab === "Pending" && "Pending Evaluation"}
              {tab === "Graded" && "Graded"}
              {tab === "Rejected" && "Rejected / Resubmit"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student or assignment..."
            className="w-full h-9 pl-9 pr-4 text-xs border rounded-lg bg-background shadow-sm outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        
        {/* Submissions List Table */}
        <div className="lg:col-span-2 border rounded-xl bg-background shadow-sm overflow-hidden divide-y divide-slate-100">
          
          {loading && (
            <div className="p-6 text-center text-muted-foreground animate-pulse">Loading homework pipeline...</div>
          )}

          {!loading && filteredSubmissions.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No matching homework submissions inside the evaluation pipeline.
            </div>
          )}

          {!loading && filteredSubmissions.map((sub) => (
            <div key={sub.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">{sub.studentName}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-800 truncate">{sub.assignmentTitle}</h3>
                
                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  {sub.status === "Pending" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="h-3 w-3" /> Pending Evaluation
                    </span>
                  )}
                  {sub.status === "Graded" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> Graded ({sub.marks}/{sub.maxMarks})
                    </span>
                  )}
                  {sub.status === "Rejected" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                      <XCircle className="h-3 w-3" /> Rejected
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

        {/* Grading details Panel */}
        <div className="p-5 sm:p-6 border rounded-xl bg-background shadow-sm space-y-4">
          {selectedSubmission ? (
            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <h3 className="text-md font-bold text-slate-900">Grading Workspace</h3>
                <p className="text-[10px] text-muted-foreground">Evaluating {selectedSubmission.studentName}&apos;s file</p>
              </div>

              {/* Submitted Answer Text */}
              <div className="p-3 border rounded-lg bg-slate-50 text-xs text-slate-700 leading-relaxed max-h-40 overflow-y-auto">
                <span className="font-bold text-slate-900 block mb-1">Student Answer:</span>
                &quot;{selectedSubmission.answer}&quot;
              </div>

              {/* Attachment Preview Placeholder */}
              {selectedSubmission.attachmentUrl && (
                <div className="flex items-center justify-between p-2 border border-blue-100 bg-blue-50/50 rounded-lg text-xs">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5 truncate">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    Student_Homework_Upload.pdf
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

              {/* Grading Input Fields */}
              <div className="space-y-3 pt-3 border-t">
                
                {/* Scoring */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Score (Out of {selectedSubmission.maxMarks}):
                  </label>
                  <input
                    type="number"
                    max={selectedSubmission.maxMarks}
                    min={0}
                    value={gradeMarks}
                    onChange={(e) => setGradeMarks(Number(e.target.value))}
                    className="w-full h-9 px-3 text-xs border rounded-lg outline-none focus:border-slate-400 bg-background"
                  />
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Submission Status:</label>
                  <select
                    value={gradingStatus}
                    onChange={(e) => setGradingStatus(e.target.value as "Graded" | "Rejected")}
                    className="w-full h-9 px-3 text-xs border rounded-lg outline-none bg-background focus:border-slate-400"
                  >
                    <option value="Graded">Graded (Accept Submission)</option>
                    <option value="Rejected">Rejected (Request Resubmission)</option>
                  </select>
                </div>

                {/* Feedback */}
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

                {/* Submit Action Buttons */}
                <button
                  type="submit"
                  className="w-full h-9 bg-blue-950 text-white font-bold text-xs rounded-lg hover:bg-slate-900 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Evaluation Metrics
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[25vh]">
              <AlertCircle className="h-6 w-6 mb-2 text-muted-foreground/50" />
              <p className="text-xs">Select any submitted homework item from the left to start evaluating and managing grades.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}