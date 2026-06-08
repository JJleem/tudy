'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Concept } from '@/lib/concepts'

interface Progress {
  insightCount: number
  score: number | null
}

function loadProgress(conceptId: string): Progress {
  try {
    const insights = JSON.parse(localStorage.getItem(`insights_${conceptId}`) ?? '[]')
    const scoreRaw = localStorage.getItem(`score_${conceptId}`)
    return { insightCount: insights.length, score: scoreRaw ? parseInt(scoreRaw) : null }
  } catch {
    return { insightCount: 0, score: null }
  }
}

interface Props {
  concept: Concept
  courseColor: string
  course: string
}

export default function ConceptCard({ concept, courseColor, course }: Props) {
  const [progress, setProgress] = useState<Progress | null>(null)

  useEffect(() => {
    setProgress(loadProgress(concept.id))
  }, [concept.id])

  const hasProgress = progress && (progress.insightCount > 0 || progress.score !== null)

  return (
    <Link
      href={`/${course}/${concept.id}`}
      className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-gray-300 transition-all block"
    >
      <div className="w-5 h-0.5 rounded mb-3" style={{ backgroundColor: courseColor }} />
      <h3 className="text-gray-900 font-semibold mb-1">{concept.name}</h3>
      <p className="text-gray-400 text-xs leading-relaxed">{concept.description}</p>

      {hasProgress && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
          {progress.insightCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-green-600 font-medium">
              <span>✅</span>
              <span>{progress.insightCount}개 이해</span>
            </span>
          )}
          {progress.score !== null && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${courseColor}18`, color: courseColor }}
            >
              🎯 {progress.score}점
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
