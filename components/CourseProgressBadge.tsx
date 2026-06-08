'use client'

import { useEffect, useState } from 'react'

interface Props {
  conceptIds: string[]
  color: string
  variant?: 'card' | 'header'
}

interface Counts {
  completed: number
  started: number
  total: number
}

export default function CourseProgressBadge({ conceptIds, color, variant = 'card' }: Props) {
  const [counts, setCounts] = useState<Counts | null>(null)

  useEffect(() => {
    let completed = 0
    let started = 0
    for (const id of conceptIds) {
      if (localStorage.getItem(`score_${id}`)) {
        completed++
      } else {
        try {
          const insights = JSON.parse(localStorage.getItem(`insights_${id}`) ?? '[]')
          if (insights.length > 0) started++
        } catch {}
      }
    }
    setCounts({ completed, started, total: conceptIds.length })
  }, [conceptIds])

  if (!counts || (counts.completed === 0 && counts.started === 0)) return null

  const pct = Math.round((counts.completed / counts.total) * 100)

  if (variant === 'header') {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold" style={{ color }}>
            {counts.completed} / {counts.total} 완료
          </span>
          {counts.started > 0 && (
            <span className="text-xs text-gray-400">{counts.started}개 진행 중</span>
          )}
          <span className="text-xs text-gray-300">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden w-48">
          <div
            className="h-full rounded-full"
            style={{ backgroundColor: color, width: `${pct}%`, transition: 'width 0.4s ease' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-semibold" style={{ color }}>
          {counts.completed} / {counts.total} 완료
        </span>
        {counts.started > 0 && (
          <span className="text-[11px] text-gray-400">{counts.started}개 진행 중</span>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ backgroundColor: color, width: `${pct}%`, transition: 'width 0.4s ease' }}
        />
      </div>
    </div>
  )
}
