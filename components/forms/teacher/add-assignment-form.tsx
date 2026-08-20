"use client"

import * as React from "react"
import { Assignment } from "@/types/api" // Imported directly to resolve CS2322
import { Plus, UploadCloud, CheckCircle2, Loader2, Link, Save } from "lucide-react"
import { useUpload } from "@/hooks/common/use-upload"

export interface CreateAssignmentPayload {
  title: string
  description: string
  deadline: string
  maxMarks: number
  isPublished: boolean
  subjectId: string
  attachmentUrl?: string
}

interface AddAssignmentFormProps {
  onSubmit: (payload: CreateAssignmentPayload) => Promise<void>
  isSubmitting: boolean
  subjects: Array<{ id: string; name: string; courseName?: string | null }>
  initialData?: Assignment | null // Strongly typed
  t: {
    addAssignment: string
    editAssignment: string
    updateAssignment: string
    titleLabel: string
    titlePlaceholder: string
    descLabel: string
    descPlaceholder: string
    deadlineLabel: string
    maxMarksLabel: string
    subjectLabel: string
    subjectPlaceholder: string
    publishLabel: string
    attachmentLabel: string
    attachmentPlaceholder: string
  }
}

// Timezone-safe date converter for datetime-local picker input
const formatDateTimeLocal = (isoString?: string) => {
  if (!isoString) return ""
  const date = new Date(isoString)
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

export default function AddAssignmentForm({ 
  onSubmit, 
  isSubmitting, 
  subjects, 
  initialData,
  t 
}: AddAssignmentFormProps) {
  const { uploadFile, uploading, error: uploadError } = useUpload()

  // Form Fields
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [deadline, setDeadline] = React.useState("")
  const [maxMarks, setMaxMarks] = React.useState<number>(100)
  const [isPublished, setIsPublished] = React.useState(true)
  const [subjectId, setSubjectId] = React.useState("")
  
  // Attachment Mode
  const [uploadMode, setUploadMode] = React.useState<"local" | "link">("local")
  const [attachmentUrl, setAttachmentUrl] = React.useState("")

  // Pre-populate fields on edit mode initialization with deferred state update to satisfy ESLint
  React.useEffect(() => {
    let isMounted = true

    const timer = setTimeout(() => {
      if (isMounted) {
        if (initialData) {
          setTitle(initialData.title)
          setDescription(initialData.description)
          setDeadline(formatDateTimeLocal(initialData.deadline))
          setMaxMarks(initialData.maxMarks)
          setIsPublished(initialData.isPublished)
          setSubjectId(initialData.subjectId)
          
          const fileUrl = initialData.attachmentUrl || ""
          setAttachmentUrl(fileUrl)
          // If it looks like a hosted file, default to local, otherwise treat as link
          setUploadMode(fileUrl.includes("/uploads/") ? "local" : "link")
        } else {
          setTitle("")
          setDescription("")
          setDeadline("")
          setMaxMarks(100)
          setIsPublished(true)
          setSubjectId("")
          setAttachmentUrl("")
        }
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !subjectId || !deadline) return

    const selectedDate = new Date(deadline)
    if (selectedDate <= new Date()) {
      alert("The deadline must be a future date.")
      return
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        deadline: selectedDate.toISOString(),
        maxMarks,
        isPublished,
        subjectId,
        attachmentUrl: attachmentUrl.trim() ? attachmentUrl.trim() : undefined
      })

      // Only reset fields if we are creating new (not editing)
      if (!initialData) {
        setTitle("")
        setDescription("")
        setDeadline("")
        setMaxMarks(100)
        setIsPublished(true)
        setSubjectId("")
        setAttachmentUrl("")
      }
    } catch {
      // Handled silently
    }
  }

  const isFormInvalid = !title.trim() || !subjectId || !deadline

  return (
    <form onSubmit={handleSubmit} className="p-5 border rounded-xl bg-background shadow-sm space-y-4 max-w-2xl animate-in fade-in duration-200">
      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
        {initialData ? t.editAssignment : t.addAssignment}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Subject Select */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-bold text-slate-700 block">{t.subjectLabel}</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            disabled={isSubmitting || !!initialData} // Subject change is locked during edit mode to preserve assignments integrity
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 outline-none"
          >
            <option value="">{t.subjectPlaceholder}</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.courseName ? `${sub.courseName} - ` : ""}{sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-bold text-slate-700 block">{t.titleLabel}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.titlePlaceholder}
            disabled={isSubmitting}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 outline-none"
          />
        </div>

        {/* Description */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-bold text-slate-700 block">{t.descLabel}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.descPlaceholder}
            disabled={isSubmitting}
            rows={3}
            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none disabled:opacity-50 outline-none"
          />
        </div>

        {/* Deadline */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 block">{t.deadlineLabel}</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            disabled={isSubmitting}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 outline-none"
          />
        </div>

        {/* Max Marks */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 block">{t.maxMarksLabel}</label>
          <input
            type="number"
            min={1}
            value={maxMarks}
            onChange={(e) => setMaxMarks(Number(e.target.value))}
            disabled={isSubmitting}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 outline-none"
          />
        </div>

        {/* Dual Mode Attachment Selector */}
        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between border-b pb-1.5">
            <label className="text-xs font-bold text-slate-700 block">{t.attachmentLabel}</label>
            <div className="flex gap-1.5 p-0.5 border rounded bg-muted/40">
              <button
                type="button"
                onClick={() => { setUploadMode("local"); setAttachmentUrl(""); }}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${uploadMode === "local" ? "bg-background shadow-sm text-slate-900" : "text-muted-foreground"}`}
              >
                Local File (PC)
              </button>
              <button
                type="button"
                onClick={() => { setUploadMode("link"); setAttachmentUrl(""); }}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${uploadMode === "link" ? "bg-background shadow-sm text-slate-900" : "text-muted-foreground"}`}
              >
                Drive Link
              </button>
            </div>
          </div>

          {uploadMode === "local" ? (
            <div className="p-4 border border-dashed rounded-lg bg-slate-50/50 flex flex-col items-center justify-center space-y-2">
              <input
                type="file"
                id="form-attachment"
                accept=".pdf,.png,.jpg,.jpeg,.docx,.zip"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const url = await uploadFile(file)
                    if (url) setAttachmentUrl(url)
                  }
                }}
                className="hidden"
                disabled={isSubmitting || uploading}
              />
              {uploading ? (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-900" /> Uploading to server...
                </div>
              ) : attachmentUrl ? (
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Worksheet uploaded successfully!
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-sm">{attachmentUrl}</p>
                </div>
              ) : (
                <label 
                  htmlFor="form-attachment"
                  className="cursor-pointer px-4 h-8 text-xs font-bold border rounded-lg bg-background hover:bg-accent flex items-center gap-1 shadow-sm"
                >
                  <UploadCloud className="h-4 w-4" /> Choose File from PC
                </label>
              )}
              <p className="text-[10px] text-muted-foreground">Supported: PDF, PNG, JPG, DOCX, ZIP (Max 10MB)</p>
              {uploadError && <p className="text-[10px] text-destructive font-bold">{uploadError}</p>}
            </div>
          ) : (
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder={t.attachmentPlaceholder}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 outline-none"
              />
            </div>
          )}
        </div>

        {/* Publish Immediately Toggle */}
        <div className="flex items-center gap-2 sm:col-span-2 py-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            disabled={isSubmitting}
            className="h-4.5 w-4.5 rounded border-input text-blue-900 bg-background outline-none"
          />
          <label htmlFor="isPublished" className="text-xs font-semibold text-slate-800 cursor-pointer">
            {t.publishLabel}
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t">
        <button
          type="submit"
          disabled={isSubmitting || isFormInvalid || uploading}
          className="flex items-center gap-1.5 px-4 h-10 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-950 rounded-lg transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {initialData ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {initialData ? t.updateAssignment : t.addAssignment}
        </button>
      </div>
    </form>
  )
}