'use client'

import { useState, useEffect } from 'react'
import SocratesChat from './SocratesChat'
import ConceptGraph from './ConceptGraph'
import { Concept, courses, Course } from '@/lib/concepts'

interface Insight {
  text: string
  time: Date
}

interface Props {
  concept: Concept
}

export default function SessionClient({ concept }: Props) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [sessionKey, setSessionKey] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const courseColor = courses[concept.course as Course].color
  const insightKey = `insights_${concept.id}`

  useEffect(() => {
    const saved = localStorage.getItem(insightKey)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved)
      setInsights(parsed.map((i: Insight & { time: string }) => ({ ...i, time: new Date(i.time) })))
    } catch {}
  }, [sessionKey])

  useEffect(() => {
    if (insights.length > 0) localStorage.setItem(insightKey, JSON.stringify(insights))
  }, [insights])

  function handleInsight(text: string, time: Date) {
    setInsights(prev => [...prev, { text, time }])
  }

  function handleReset() {
    localStorage.removeItem(`chat_${concept.id}`)
    localStorage.removeItem(insightKey)
    localStorage.removeItem(`score_${concept.id}`)
    localStorage.removeItem(`summary_${concept.id}`)
    setInsights([])
    setSessionKey(k => k + 1)
    setShowModal(false)
  }

  return (
    <>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col border-r border-gray-200 overflow-hidden">
          <SocratesChat key={sessionKey} concept={concept} onInsight={handleInsight} />
        </div>

        <div className="w-80 shrink-0 p-6 overflow-y-auto hidden md:flex md:flex-col gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors text-left"
          >
            처음부터 시작하기 →
          </button>
          <ConceptGraph concept={concept} />

          {insights.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">이해 로그</p>
              <div className="flex flex-col gap-1.5">
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-green-100 bg-green-50 px-3 py-2 flex gap-2 items-start"
                  >
                    <span className="text-[10px] text-gray-400 shrink-0 mt-0.5 font-mono">
                      {insight.time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                    <span className="text-xs text-green-800 leading-relaxed">{insight.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl flex flex-col items-center gap-3"
            onClick={e => e.stopPropagation()}
          >
            <img src="/img/13_OMG.png" alt="" className="w-20 h-20 object-contain" />
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-base mb-1">정말 초기화할까요?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                대화 기록, 이해 로그, 점수가 모두 삭제됩니다.
              </p>
              <p className="text-xs font-semibold text-red-500 mt-1">삭제 후 복구할 수 없습니다.</p>
            </div>
            <div className="flex gap-2 w-full mt-1">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
