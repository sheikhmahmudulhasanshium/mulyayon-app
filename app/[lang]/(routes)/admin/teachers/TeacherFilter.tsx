"use client"

import * as React from "react"
import { Search, RefreshCw } from "lucide-react"

interface TeacherFiltersProps {
  level: string
  setLevel: (v: string) => void
  specialty: string
  setSpecialty: (v: string) => void
  version: string
  setVersion: (v: string) => void
  onlyUnassigned: boolean
  setOnlyUnassigned: (v: boolean) => void
  onSearch: () => void
  t: {
    searchTitle: string
    level: string
    specialty: string
    version: string
    unassignedOnly: string
    search: string
    all: string
  }
}

export default function TeacherFilters({
  level,
  setLevel,
  specialty,
  setSpecialty,
  version,
  setVersion,
  onlyUnassigned,
  setOnlyUnassigned,
  onSearch,
  t,
}: TeacherFiltersProps) {
  return (
    <div className="p-5 border rounded-xl bg-background shadow-sm space-y-5">
      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
        <Search className="h-4 w-4" />
        {t.searchTitle}
      </h3>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.level}</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none"
          >
            <option value="">{t.all}</option>
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
            <option value="Higher Secondary">Higher Secondary</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.specialty}</label>
          <input
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="e.g. Mathematics"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.version}</label>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none"
          >
            <option value="">{t.all}</option>
            <option value="BV">Bangla Version (BV)</option>
            <option value="EV">English Version (EV)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            id="unassigned-checkbox"
            type="checkbox"
            checked={onlyUnassigned}
            onChange={(e) => setOnlyUnassigned(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900 cursor-pointer"
          />
          <label htmlFor="unassigned-checkbox" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
            {t.unassignedOnly}
          </label>
        </div>

        <button
          onClick={onSearch}
          className="w-full flex items-center justify-center gap-2 h-9 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-950 rounded-lg transition-colors pt-2"
        >
          <RefreshCw className="h-4 w-4" />
          {t.search}
        </button>
      </div>
    </div>
  )
}