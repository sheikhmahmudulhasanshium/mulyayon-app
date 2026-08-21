"use client"

import * as React from "react"
import { useStudent, StudentAssignmentResponse } from "@/hooks/student/use-student"
import { useSubmissions } from "@/hooks/common/use-submissions"
import { useUpload } from "@/hooks/common/use-upload"
import { 
  AlertCircle, 
  Calendar, 
  Award, 
  Clock, 
  CheckCircle2, 
  UploadCloud, 
  Loader2, 
  ExternalLink,
  Send,
  Save,
  MessageSquare
} from "lucide-react"

interface BodyProps {
  locale: "en" | "bn"
}

export default function Body({ locale }: BodyProps) {
  const { getMyAssignments, loading } = useStudent()
  const { submitAnswer, updateSubmission } = useSubmissions()
  const { uploadFile, uploading: fileUploading, error: uploadError } = useUpload()

  const [assignmentStatus, setAssignmentStatus] = React.useState<"Pending" | "Submitted" | "Graded" | "Rejected">("Pending")
  const [studentTasks, setStudentTasks] = React.useState<StudentAssignmentResponse[]>([])
  const [selectedAssignmentId, setSelectedAssignmentId] = React.useState<string>("")

  const [answer, setAnswer] = React.useState("")
  const [attachmentUrl, setAttachmentUrl] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  const loadData = React.useCallback(async () => {
    try {
      const res = await getMyAssignments()
      setStudentTasks(res)
    } catch {
      // Handled silently
    }
  }, [getMyAssignments])

  // Defer execution outside synchronous layout to satisfy ESLint
  React.useEffect(() => {
    let isMounted = true
    const timer = setTimeout(() => {
      if (isMounted) {
        loadData()
      }
    }, 0)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [loadData])

  const activeTask = studentTasks.find(t => t.assignment.id === selectedAssignmentId)
  const activeAssignment = activeTask?.assignment
  const activeSubmission = activeTask?.submission

  // Defer internal form state updates to satisfy ESLint
  React.useEffect(() => {
    let isMounted = true
    const timer = setTimeout(() => {
      if (!isMounted) return
      if (activeSubmission) {
        setAnswer(activeSubmission.answer || "")
        setAttachmentUrl(activeSubmission.attachmentUrl || "")
      } else {
        setAnswer("")
        setAttachmentUrl("")
      }
    }, 0)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [selectedAssignmentId, activeSubmission])

  const isDeadlinePassed = activeAssignment ? new Date() > new Date(activeAssignment.deadline) : false

  const handleLocalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file)
    if (url) setAttachmentUrl(url)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssignmentId || !answer.trim() || isDeadlinePassed) return

    setSubmitting(true)
    try {
      if (activeSubmission) {
        await updateSubmission(activeSubmission.id, answer, attachmentUrl || undefined)
        alert(locale === "bn" ? "উত্তরটি সফলভাবে আপডেট করা হয়েছে!" : "Submission updated successfully!")
      } else {
        await submitAnswer(selectedAssignmentId, answer, attachmentUrl || undefined)
        alert(locale === "bn" ? "উত্তরটি সফলভাবে জমা দেওয়া হয়েছে!" : "Homework submitted successfully!")
      }
      loadData()
    } catch {
      // Handled silently
    } finally {
      setSubmitting(false)
    }
  }

  const pipelineGroups = React.useMemo(() => {
    const pending: StudentAssignmentResponse[] = []
    const submitted: StudentAssignmentResponse[] = []
    const graded: StudentAssignmentResponse[] = []
    const rejected: StudentAssignmentResponse[] = []

    for (const task of studentTasks) {
      const sub = task.submission
      if (!sub) pending.push(task)
      else if (sub.status === "Submitted") submitted.push(task)
      else if (sub.status === "Graded") graded.push(task)
      else if (sub.status === "Rejected") rejected.push(task)
    }

    return { Pending: pending, Submitted: submitted, Graded: graded, Rejected: rejected }
  }, [studentTasks])

  const currentCategoryTasks = pipelineGroups[assignmentStatus]

  if (loading && studentTasks.length === 0) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded"></div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-64 border rounded-xl lg:col-span-2 bg-muted/20"></div>
          <div className="h-64 border rounded-xl bg-muted/20"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        
        {/* Homework Category Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap gap-1.5 p-1 border rounded-lg bg-muted/40 self-start w-fit">
            {(["Pending", "Submitted", "Graded", "Rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setAssignmentStatus(status)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  assignmentStatus === status 
                    ? "bg-background shadow-sm text-slate-900" 
                    : "text-muted-foreground hover:text-slate-900"
                }`}
              >
                {status === "Pending" && (locale === "bn" ? "চলতি বাড়ির কাজ" : "Pending Homework")}
                {status === "Submitted" && (locale === "bn" ? "মূল্যায়নের অপেক্ষায়" : "Awaiting Evaluation")}
                {status === "Graded" && (locale === "bn" ? "মূল্যায়ন সম্পন্ন" : "Evaluation Complete")}
                {status === "Rejected" && (locale === "bn" ? "পুনরায় জমার নির্দেশ" : "Needs Resubmit")}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {currentCategoryTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground border rounded-xl bg-slate-50/50 sm:col-span-2">
                {locale === "bn" ? "এই ক্যাটাগরিতে কোনো বাড়ির কাজ পাওয়া যায়নি।" : "No homework fits this status category."}
              </div>
            ) : (
              currentCategoryTasks.map(({ assignment }) => {
                const formattedDeadline = new Date(assignment.deadline).toLocaleDateString(
                  locale === "bn" ? "bn-BD" : "en-US",
                  { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                )
                const isSelected = assignment.id === selectedAssignmentId

                return (
                  <div 
                    key={assignment.id} 
                    onClick={() => setSelectedAssignmentId(assignment.id)}
                    className={`p-5 border rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer ${
                      isSelected ? "border-blue-900 ring-2 ring-blue-900/10 bg-blue-50/5" : "bg-background"
                    }`}
                  >
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900 text-base line-clamp-1">{assignment.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{assignment.description}</p>
                    </div>

                    <div className="border-t pt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-blue-900" />
                        <span>{locale === "bn" ? "শেষ সময়" : "Due"}: {formattedDeadline}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5 text-blue-900" />
                        <span>{locale === "bn" ? "নম্বর" : "Marks"}: <strong>{assignment.maxMarks}</strong></span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Submission Workspace Form */}
        <div className="p-5 sm:p-6 border rounded-xl bg-background shadow-sm space-y-5">
          {activeAssignment ? (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <h3 className="text-md font-bold text-slate-900">{locale === "bn" ? "অ্যাসাইনমেন্ট জমা দেওয়ার ঘর" : "Submission Workspace"}</h3>
                <p className="text-[10px] text-muted-foreground tracking-wide mt-0.5">
                  {locale === "bn" ? "নির্দেশনা পড়ুন, সমাধান লিখুন এবং অ্যাসাইনমেন্ট ফাইল আপলোড করুন।" : "Read instructions, write solutions, and attach worksheets."}
                </p>
              </div>

              <div className="p-4 border border-blue-100 bg-blue-50/20 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-slate-900 block border-b pb-1">{activeAssignment.title}</span>
                <p className="text-slate-600 leading-relaxed italic mt-1">&quot;{activeAssignment.description}&quot;</p>
                {activeAssignment.attachmentUrl && (
                  <a 
                    href={activeAssignment.attachmentUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-bold underline mt-1.5"
                  >
                    Reference Worksheet <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              {activeSubmission && activeSubmission.status === "Graded" ? (
                <div className="p-4 border border-emerald-100 bg-emerald-50/30 rounded-xl space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <CheckCircle2 className="h-4 w-4" /> {locale === "bn" ? "মূল্যায়ন সম্পন্ন" : "Graded"}: {activeSubmission.marks} / {activeAssignment.maxMarks}
                  </span>
                  {activeSubmission.feedback && (
                    <div className="text-xs text-slate-700 leading-normal pt-1.5 border-t border-emerald-100 flex items-start gap-1.5">
                      <MessageSquare className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">{locale === "bn" ? "শিক্ষকের মন্তব্য:" : "Teacher Feedback:"}</span>
                        &quot;{activeSubmission.feedback}&quot;
                      </div>
                    </div>
                  )}
                </div>
              ) : activeSubmission && activeSubmission.status === "Rejected" ? (
                <div className="p-4 border border-red-200 bg-red-50/30 rounded-xl space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 border border-red-200 text-red-700 animate-pulse">
                    <AlertCircle className="h-4 w-4" /> {locale === "bn" ? "পুনরায় জমার নির্দেশ" : "Rejected / Needs Resubmit"}
                  </span>
                  {activeSubmission.feedback && (
                    <div className="text-xs text-red-700 leading-normal pt-1.5 border-t border-red-200 flex items-start gap-1.5">
                      <MessageSquare className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-red-950 block mb-0.5">{locale === "bn" ? "সংশোধন নির্দেশাবলী:" : "Rewrite Instructions:"}</span>
                        <p className="font-semibold italic text-red-950">&quot;{activeSubmission.feedback}&quot;</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeSubmission ? (
                <div className="p-3 border border-amber-100 bg-amber-50/20 rounded-lg text-xs text-amber-800 font-bold flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-500" /> {locale === "bn" ? "উত্তর জমা দেওয়া হয়েছে" : "Answer Submitted"}
                </div>
              ) : null}

              <div className="space-y-1.5 pt-2 border-t">
                <label className="text-xs font-bold text-slate-800">{locale === "bn" ? "আপনার উত্তর / সমাধান নোটসমূহ:" : "Your Answer / Solution Notes:"}</label>
                <textarea
                  rows={5}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={locale === "bn" ? "এখানে আপনার লিখিত উত্তর, সমাধান সমাধান ধাপসমূহ বা নোট টাইপ করুন..." : "Type your steps, text solutions, or notes here..."}
                  disabled={submitting || isDeadlinePassed || (activeSubmission?.status === "Graded")}
                  className="w-full p-3 text-xs border rounded-lg outline-none bg-background focus:border-slate-400 resize-none disabled:opacity-50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">{locale === "bn" ? "অ্যাসাইনমেন্ট ফাইল যুক্ত করুন (ঐচ্ছিক, সর্বোচ্চ ১০MB):" : "Attach Homework File (Optional, Max 10MB):"}</label>
                <div className="p-4 border border-dashed rounded-lg bg-slate-50/50 flex flex-col items-center justify-center space-y-2">
                  <input
                    type="file"
                    id="student-local-file"
                    accept=".pdf,.png,.jpg,.jpeg,.docx,.zip"
                    onChange={handleLocalFileUpload}
                    className="hidden"
                    disabled={submitting || isDeadlinePassed || fileUploading || (activeSubmission?.status === "Graded")}
                  />
                  {fileUploading ? (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-900" /> Uploading script...
                    </div>
                  ) : attachmentUrl ? (
                    <div className="text-center space-y-1">
                      <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> {locale === "bn" ? "অ্যাসাইনমেন্ট ফাইলটি সফলভাবে আপলোড করা হয়েছে!" : "Homework file uploaded successfully!"}
                      </p>
                      <a 
                        href={attachmentUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[10px] text-blue-700 hover:text-blue-900 font-bold underline truncate max-w-sm block"
                      >
                        View My Uploaded File <ExternalLink className="h-3 w-3 inline shrink-0" />
                      </a>
                      {activeSubmission?.status !== "Graded" && !isDeadlinePassed && (
                        <button
                          type="button"
                          onClick={() => setAttachmentUrl("")}
                          className="text-[10px] text-red-600 hover:text-red-800 font-bold underline block mx-auto mt-1 cursor-pointer"
                        >
                          {locale === "bn" ? "ফাইল পরিবর্তন করুন" : "Remove & Upload New File"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <label 
                      htmlFor="student-local-file"
                      className={`cursor-pointer px-4 h-8 text-xs font-bold border rounded-lg bg-background hover:bg-accent flex items-center gap-1.5 shadow-sm ${
                        (isDeadlinePassed || activeSubmission?.status === "Graded") ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <UploadCloud className="h-4 w-4" /> Choose File from PC
                    </label>
                  )}
                  <p className="text-[10px] text-muted-foreground">Supported: PDF, PNG, JPG (Max 10MB)</p>
                  {uploadError && <p className="text-[10px] text-destructive font-bold">{uploadError}</p>}
                </div>
              </div>

              {isDeadlinePassed ? (
                <div className="p-3 border border-red-100 bg-red-50/30 rounded-lg text-xs text-red-700 font-bold flex items-center justify-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-red-500" /> {locale === "bn" ? "সময় শেষ (আর জমা নেওয়া হচ্ছে না)" : "Submission Closed (Deadline passed)"}
                </div>
              ) : activeSubmission?.status === "Graded" ? null : (
                <button
                  type="submit"
                  disabled={submitting || fileUploading || !answer.trim()}
                  className="w-full h-10 bg-blue-950 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : activeSubmission ? (
                    <Save className="h-4.5 w-4.5" />
                  ) : (
                    <Send className="h-4.5 w-4.5" />
                  )}
                  {activeSubmission 
                    ? activeSubmission.status === "Rejected"
                      ? (locale === "bn" ? "সংশোধন করে জমা দিন" : "Submit Corrections")
                      : (locale === "bn" ? "উত্তর পরিবর্তন করুন" : "Update My Submission") 
                    : (locale === "bn" ? "উত্তর দিন" : "Submit Homework")}
                </button>
              )}
            </form>
          ) : (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[30vh]">
              <AlertCircle className="h-6 w-6 mb-2 text-muted-foreground/40" />
              <p className="text-xs leading-normal">
                {locale === "bn" ? "আপনার ওয়ার্কস্পেস খুলতে এবং সমাধান জমা দিতে বাম দিক থেকে যেকোনো অ্যাসাইনমেন্ট নির্বাচন করুন।" : "Select any homework from the list to open your submission workspace."}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}