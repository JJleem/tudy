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

function NodeLabel({ x, y, text, size }: { x: number; y: number; text: string; size: number }) {
  const lines = text.length > 4
    ? [text.slice(0, Math.ceil(text.length / 2)), text.slice(Math.ceil(text.length / 2))]
    : [text]
  const lh = size * 1.45
  const startY = y - ((lines.length - 1) * lh) / 2

  return (
    <text textAnchor="middle" fill="#fff" fontSize={size} fontWeight="700" style={{ userSelect: 'none' }}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} y={startY + i * lh}>{line}</tspan>
      ))}
    </text>
  )
}

export default function ConceptGraph({ concept }: Props) {
  const related = getRelatedConcepts(concept.id)
  const courseColor = courses[concept.course].color

  const items = useMemo(() =>
    related.map((rel, i) => {
      const angle = (2 * Math.PI * i) / related.length - Math.PI / 2
      const px = CX + ORBIT * Math.cos(angle)
      const py = CY + ORBIT * Math.sin(angle)
      const dx = px - CX
      const dy = py - CY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const nx = dx / dist
      const ny = dy / dist
      const isTo = rel.direction === 'to'

      const x1 = isTo ? CX + nx * CR         : px - nx * NR
      const y1 = isTo ? CY + ny * CR         : py - ny * NR
      const x2 = isTo ? px - nx * (NR + 5)   : CX + nx * (CR + 5)
      const y2 = isTo ? py - ny * (NR + 5)   : CY + ny * (CR + 5)

      const labelW = rel.label.length * 11 + 14
      const lx = (x1 + x2) / 2 - ny * 30
      const ly = (y1 + y2) / 2 + nx * 30

      return {
        px, py, isTo, rel, labelW,
        x1, y1, x2, y2, lx, ly,
      }
    }),
    [related]
  )

  const toId = `arr-to-${concept.id}`
  const fromId = `arr-from-${concept.id}`

  return (
    <div className="w-full flex flex-col gap-3">
      <p className="text-xs text-gray-400">개념 관계 그래프</p>
      <div className="rounded-xl border border-gray-200 bg-gray-50">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} overflow="visible" style={{ display: 'block' }}>
          <defs>
            <marker id={toId} markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
              <polygon points="0 0, 9 3.5, 0 7" fill={courseColor} />
            </marker>
            <marker id={fromId} markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
              <polygon points="0 0, 9 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>

          {/* 1. 엣지 직선 */}
          {items.map((it, i) => (
            <line key={i}
              x1={it.x1} y1={it.y1} x2={it.x2} y2={it.y2}
              stroke={it.isTo ? courseColor : '#94a3b8'} strokeWidth={2.5}
              markerEnd={`url(#${it.isTo ? toId : fromId})`}
            />
          ))}

          {/* 2. 외부 노드 */}
          {items.map((it, i) => (
            <g key={i}>
              <circle cx={it.px} cy={it.py} r={NR} fill={it.isTo ? courseColor : '#94a3b8'} />
              <NodeLabel x={it.px} y={it.py} text={it.rel.concept.name} size={11} />
            </g>
          ))}

          {/* 3. 중앙 노드 */}
          <circle cx={CX} cy={CY} r={CR} fill={courseColor} />
          <NodeLabel x={CX} y={CY} text={concept.name} size={13} />

          {/* 4. 엣지 라벨 — 가장 마지막에 렌더링해서 항상 위에 표시 */}
          {items.map((it, i) => (
            <g key={i}>
              <rect
                x={it.lx - it.labelW / 2} y={it.ly - 9}
                width={it.labelW} height={18}
                rx={4} fill="white"
                stroke={it.isTo ? courseColor : '#94a3b8'}
                strokeWidth={1}
              />
              <text x={it.lx} y={it.ly} textAnchor="middle" dominantBaseline="middle"
                fontSize={10} fontWeight="600"
                fill={it.isTo ? courseColor : '#64748b'}
                style={{ userSelect: 'none' }}>
                {it.rel.label}
              </text>
            </g>
          ))}
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
