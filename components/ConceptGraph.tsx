'use client'

import { getRelatedConcepts, courses, Concept } from '@/lib/concepts'

interface Props {
  concept: Concept
}

export default function ConceptGraph({ concept }: Props) {
  const related = getRelatedConcepts(concept.id)
  const courseColor = courses[concept.course].color

  const cx = 200
  const cy = 200
  const radius = 130
  const nodeR = 36

  const positions = related.map((_, i) => {
    const angle = (2 * Math.PI * i) / related.length - Math.PI / 2
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  })

  return (
    <div className="w-full h-full flex flex-col">
      <p className="text-xs text-zinc-500 mb-3">개념 관계 그래프</p>
      <svg viewBox="0 0 400 400" className="w-full max-w-sm mx-auto">
        <defs>
          <marker id="arrow-to" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#6366f1" />
          </marker>
          <marker id="arrow-from" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#64748b" />
          </marker>
        </defs>

        {/* Edges */}
        {related.map((rel, i) => {
          const pos = positions[i]
          const dx = pos.x - cx
          const dy = pos.y - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const ux = dx / dist
          const uy = dy / dist

          const x1 = cx + ux * nodeR
          const y1 = cy + uy * nodeR
          const x2 = pos.x - ux * nodeR
          const y2 = pos.y - uy * nodeR

          const midX = (x1 + x2) / 2
          const midY = (y1 + y2) / 2

          const isTo = rel.direction === 'to'

          return (
            <g key={rel.concept.id}>
              <line
                x1={isTo ? x1 : x2}
                y1={isTo ? y1 : y2}
                x2={isTo ? x2 : x1}
                y2={isTo ? y2 : y1}
                stroke={isTo ? '#6366f1' : '#64748b'}
                strokeWidth="1.5"
                markerEnd={isTo ? 'url(#arrow-to)' : 'url(#arrow-from)'}
                opacity={0.7}
              />
              <text
                x={midX}
                y={midY - 6}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="9"
              >
                {rel.label}
              </text>
            </g>
          )
        })}

        {/* Related nodes */}
        {related.map((rel, i) => {
          const pos = positions[i]
          return (
            <g key={rel.concept.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeR}
                fill="#1e1e1e"
                stroke={rel.direction === 'to' ? '#6366f1' : '#475569'}
                strokeWidth="1.5"
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fill={rel.direction === 'to' ? '#a5b4fc' : '#94a3b8'}
                fontSize="10"
                fontWeight="500"
              >
                {rel.concept.name.length > 5
                  ? rel.concept.name.slice(0, 5) + '…'
                  : rel.concept.name}
              </text>
            </g>
          )
        })}

        {/* Center node */}
        <circle cx={cx} cy={cy} r={nodeR + 8} fill={courseColor} opacity={0.15} />
        <circle cx={cx} cy={cy} r={nodeR} fill="#1a1a2e" stroke={courseColor} strokeWidth="2" />
        <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
          {concept.name.length > 5 ? concept.name.slice(0, 5) : concept.name}
        </text>
        {concept.name.length > 5 && (
          <text x={cx} y={cy + 10} textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
            {concept.name.slice(5)}
          </text>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-4 space-y-1 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-3 h-px bg-indigo-400 inline-block" />
          <span>이 개념이 이어지는 개념</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-px bg-slate-500 inline-block" />
          <span>이 개념의 선행 개념</span>
        </div>
      </div>
    </div>
  )
}
