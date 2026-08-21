"use client"

import * as React from "react"
import { useStudent, SubjectWithTeachers } from "@/hooks/student/use-student"
import { GraduationCap, UserCheck } from "lucide-react"

interface BodyProps {
  locale: "en" | "bn"
}

export default function Body({ locale }: BodyProps) {
  const { getMySubjects, loading } = useStudent()
  const [subjects, setSubjects] = React.useState<SubjectWithTeachers[]>([])

  React.useEffect(() => {
    let isMounted = true
    const timer = setTimeout(() => {
      if (isMounted) {
        getMySubjects().then(res => setSubjects(res))
      }
    }, 0)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [getMySubjects])

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded"></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-32 bg-muted/20 border rounded-xl"></div>
          <div className="h-32 bg-muted/20 border rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="p-5 border rounded-xl bg-background shadow-sm space-y-1">
        <h3 className="text-md font-bold text-slate-950 flex items-center gap-1.5">
          <GraduationCap className="h-5 w-5 text-blue-900" /> 
          {locale === "bn" ? "আমার নিবন্ধিত কোর্স" : "My Registered Course"}
        </h3>
        <p className="text-xs text-muted-foreground">
          {locale === "bn" ? "চলমান কোর্সের বিষয় ও শিক্ষক তালিকা" : "Enrolled Course Subject Directory"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.length > 0 ? (
          subjects.map((sub) => (
            <div key={sub.id} className="p-5 border rounded-xl bg-background shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  {locale === "bn" ? "নিবন্ধিত বিষয়" : "Enrolled Subject"}
                </span>
                <h3 className="text-md font-bold text-slate-950">{sub.name}</h3>
                <p className="text-xs text-muted-foreground">{sub.nameBn}</p>
              </div>

              <div className="border-t pt-3 space-y-2">
                <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-blue-900/50" /> 
                  {locale === "bn" ? "নিযুক্ত শিক্ষকবৃন্দ:" : "Assigned Teachers:"}
                </span>
                <div className="space-y-1.5">
                  {sub.teachers && sub.teachers.length > 0 ? (
                    sub.teachers.map((teacher) => (
                      <div key={teacher.id} className="text-xs flex items-center justify-between text-slate-800">
                        <span className="font-semibold truncate max-w-36">{teacher.name}</span>
                        {teacher.specialties && teacher.specialties.length > 0 && (
                          <span className="text-[8px] font-bold bg-blue-50 border border-blue-200 text-blue-950 px-1.5 py-0.5 rounded">
                            {teacher.specialties[0]}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-muted-foreground italic">
                      {locale === "bn" ? "কোনো শিক্ষক নিযুক্ত নেই" : "No teachers assigned yet."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-muted-foreground border rounded-xl bg-slate-50/50 sm:col-span-3">
            {locale === "bn" ? "কোনো বিষয় পাওয়া যায়নি।" : "No subjects resolved."}
          </div>
        )}
      </div>
    </div>
  )
}