'use client'

import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react'
import type { Node, Edge, NodeProps } from '@xyflow/react'
import { getRelatedConcepts, courses, Concept } from '@/lib/concepts'

type CenterNodeData = { label: string; color: string }
type RelatedNodeData = { label: string; direction: 'to' | 'from' }

function CenterNodeComponent({ data }: NodeProps<Node<CenterNodeData>>) {
  return (
    <>
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} id="tt" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} id="tb" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="tl" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} id="tr" style={{ opacity: 0 }} />
      <div
        className="flex items-center justify-center rounded-full font-bold text-white text-center leading-tight"
        style={{
          width: 80,
          height: 80,
          background: data.color + '20',
          border: `2.5px solid ${data.color}`,
          fontSize: 11,
          padding: 6,
          boxShadow: `0 0 16px ${data.color}44`,
        }}
      >
        {data.label}
      </div>
    </>
  )
}

function RelatedNodeComponent({ data }: NodeProps<Node<RelatedNodeData>>) {
  const isTo = data.direction === 'to'
  const borderColor = isTo ? '#6366f1' : '#475569'
  const textColor = isTo ? '#a5b4fc' : '#94a3b8'

  return (
    <>
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} id="tt" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} id="tb" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="tl" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} id="tr" style={{ opacity: 0 }} />
      <div
        className="flex items-center justify-center rounded-full text-center leading-tight"
        style={{
          width: 68,
          height: 68,
          background: '#18181b',
          border: `1.5px solid ${borderColor}`,
          color: textColor,
          fontSize: 10,
          fontWeight: 500,
          padding: 6,
        }}
      >
        {data.label}
      </div>
    </>
  )
}

const nodeTypes = {
  center: CenterNodeComponent,
  related: RelatedNodeComponent,
}

interface Props {
  concept: Concept
}

export default function ConceptGraph({ concept }: Props) {
  const related = getRelatedConcepts(concept.id)
  const courseColor = courses[concept.course].color

  const { nodes, edges } = useMemo(() => {
    const radius = 170
    const nodes: Node[] = [
      {
        id: 'center',
        type: 'center',
        position: { x: 0, y: 0 },
        data: { label: concept.name, color: courseColor },
        draggable: false,
        selectable: false,
      },
    ]

    const edges: Edge[] = []

    related.forEach((rel, i) => {
      const angle = (2 * Math.PI * i) / related.length - Math.PI / 2
      const x = Math.round(radius * Math.cos(angle))
      const y = Math.round(radius * Math.sin(angle))
      const nodeId = `related-${rel.concept.id}`

      nodes.push({
        id: nodeId,
        type: 'related',
        position: { x, y },
        data: { label: rel.concept.name, direction: rel.direction },
        draggable: false,
        selectable: false,
      })

      const isTo = rel.direction === 'to'
      const edgeColor = isTo ? '#6366f1' : '#64748b'

      edges.push({
        id: `edge-${rel.concept.id}`,
        source: isTo ? 'center' : nodeId,
        target: isTo ? nodeId : 'center',
        type: 'straight',
        label: rel.label,
        labelStyle: { fill: '#71717a', fontSize: 9 },
        labelBgStyle: { fill: '#09090b' },
        labelBgPadding: [2, 4],
        style: { stroke: edgeColor, strokeWidth: 1.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 14,
          height: 14,
        },
      })
    })

    return { nodes, edges }
  }, [concept, courseColor, related])

  return (
    <div className="w-full flex flex-col gap-3">
      <p className="text-xs text-zinc-500">개념 관계 그래프</p>
      <div
        className="rounded-xl overflow-hidden border border-zinc-800"
        style={{ height: 320 }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodeOrigin={[0.5, 0.5]}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          preventScrolling={false}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            color="#27272a"
            gap={20}
            size={1}
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>
      </div>
      <div className="space-y-1 text-xs text-zinc-600">
        <div className="flex items-center gap-2">
          <span className="w-4 h-px bg-indigo-500 inline-block" />
          <span>이 개념이 이어지는 개념</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-px bg-slate-600 inline-block" />
          <span>이 개념의 선행 개념</span>
        </div>
      </div>
    </div>
  )
}
