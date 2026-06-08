'use client'

import { useMemo } from 'react'
import { getRelatedConcepts, courses, Concept } from '@/lib/concepts'

interface Props {
  concept: Concept
}

const W = 340
const H = 360
const CX = W / 2
const CY = H / 2
const ORBIT = 120
const CR = 44
const NR = 38

function NodeLabel({ x, y, text, size, color }: { x: number; y: number; text: string; size: number; color: string }) {
  const lines = text.length > 4
    ? [text.slice(0, Math.ceil(text.length / 2)), text.slice(Math.ceil(text.length / 2))]
    : [text]
  const lh = size * 1.45
  const startY = y - ((lines.length - 1) * lh) / 2

  return (
    <text textAnchor="middle" fill={color} fontSize={size} fontWeight="700" style={{ userSelect: 'none' }}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} y={startY + i * lh}>{line}</tspan>
      ))}
    </text>
  )
}

export default function ConceptGraph({ concept }: Props) {
  const related = getRelatedConcepts(concept.id)
  const courseColor = courses[concept.course].color

  const outerNodes = useMemo(() =>
    related.map((rel, i) => {
      const angle = (2 * Math.PI * i) / related.length - Math.PI / 2
      return { x: CX + ORBIT * Math.cos(angle), y: CY + ORBIT * Math.sin(angle), ...rel }
    }),
    [related]
  )

  const toId = `arr-to-${concept.id}`
  const fromId = `arr-from-${concept.id}`

  return (
    <div className="w-full flex flex-col gap-3">
      <p className="text-xs text-gray-400">개념 관계 그래프</p>
      <div className="rounded-xl border border-gray-200 bg-gray-50">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
          <defs>
            <marker id={toId} markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
              <polygon points="0 0, 9 3.5, 0 7" fill={courseColor} />
            </marker>
            <marker id={fromId} markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
              <polygon points="0 0, 9 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Edges */}
          {outerNodes.map((pos, i) => {
            const isTo = pos.direction === 'to'
            const dx = pos.x - CX
            const dy = pos.y - CY
            const dist = Math.sqrt(dx * dx + dy * dy)
            const nx = dx / dist
            const ny = dy / dist

            const x1 = isTo ? CX + nx * CR         : pos.x - nx * NR
            const y1 = isTo ? CY + ny * CR         : pos.y - ny * NR
            const x2 = isTo ? pos.x - nx * (NR + 5) : CX + nx * (CR + 5)
            const y2 = isTo ? pos.y - ny * (NR + 5) : CY + ny * (CR + 5)

            const color = isTo ? courseColor : '#94a3b8'
            const lx = (x1 + x2) / 2 + (-ny * 14)
            const ly = (y1 + y2) / 2 + (nx * 14)

            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={color} strokeWidth={2.5}
                  markerEnd={`url(#${isTo ? toId : fromId})`}
                />
                <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                  fontSize={10} fontWeight="600" fill={color} style={{ userSelect: 'none' }}>
                  {pos.label}
                </text>
              </g>
            )
          })}

          {/* Outer nodes */}
          {outerNodes.map((pos, i) => (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r={NR}
                fill={pos.direction === 'to' ? courseColor : '#94a3b8'} />
              <NodeLabel x={pos.x} y={pos.y} text={pos.concept.name} size={11} color="#fff" />
            </g>
          ))}

          {/* Center node (rendered last = on top) */}
          <circle cx={CX} cy={CY} r={CR} fill={courseColor} />
          <NodeLabel x={CX} y={CY} text={concept.name} size={13} color="#fff" />
        </svg>
      </div>

      <div className="space-y-1 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-4 h-px inline-block" style={{ backgroundColor: courseColor }} />
          <span>이 개념이 이어지는 개념</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-px bg-slate-300 inline-block" />
          <span>이 개념의 선행 개념</span>
        </div>
      </div>
    </div>
  )
}
