'use client'

import { useMemo } from 'react'
import { getRelatedConcepts, courses, Concept } from '@/lib/concepts'

interface Props {
  concept: Concept
}

const W = 320
const H = 340
const CX = W / 2
const CY = H / 2
const ORBIT = 118
const CR = 44  // center node radius
const NR = 36  // outer node radius

export default function ConceptGraph({ concept }: Props) {
  const related = getRelatedConcepts(concept.id)
  const courseColor = courses[concept.course].color

  const nodes = useMemo(() =>
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
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
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
          {nodes.map((pos, i) => {
            const isTo = pos.direction === 'to'
            const dx = pos.x - CX
            const dy = pos.y - CY
            const dist = Math.sqrt(dx * dx + dy * dy)
            const nx = dx / dist
            const ny = dy / dist

            const x1 = isTo ? CX + nx * CR       : pos.x - nx * NR
            const y1 = isTo ? CY + ny * CR       : pos.y - ny * NR
            const x2 = isTo ? pos.x - nx * (NR + 5) : CX + nx * (CR + 5)
            const y2 = isTo ? pos.y - ny * (NR + 5) : CY + ny * (CR + 5)

            const color = isTo ? courseColor : '#94a3b8'
            const mx = (x1 + x2) / 2 + (-ny * 13)
            const my = (y1 + y2) / 2 + (nx * 13)

            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={color} strokeWidth={2}
                  markerEnd={`url(#${isTo ? toId : fromId})`}
                />
                <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle"
                  fontSize={10} fontWeight="600" fill={color}>
                  {pos.label}
                </text>
              </g>
            )
          })}

          {/* Center node */}
          <circle cx={CX} cy={CY} r={CR} fill={courseColor} />
          <foreignObject x={CX - CR} y={CY - CR} width={CR * 2} height={CR * 2}>
            <div style={{
              width: '100%', height: '100%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', fontSize: 13, fontWeight: 700,
              color: '#fff', lineHeight: 1.3, padding: 6,
            }}>
              {concept.name}
            </div>
          </foreignObject>

          {/* Outer nodes */}
          {nodes.map((pos, i) => {
            const fill = pos.direction === 'to' ? courseColor : '#94a3b8'
            return (
              <g key={i}>
                <circle cx={pos.x} cy={pos.y} r={NR} fill={fill} />
                <foreignObject x={pos.x - NR} y={pos.y - NR} width={NR * 2} height={NR * 2}>
                  <div style={{
                    width: '100%', height: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', fontSize: 11, fontWeight: 600,
                    color: '#fff', lineHeight: 1.3, padding: 4,
                  }}>
                    {pos.concept.name}
                  </div>
                </foreignObject>
              </g>
            )
          })}
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
