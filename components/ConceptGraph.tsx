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

type CenterNodeData = { label: string }
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
        className="flex items-center justify-center rounded-full font-bold text-center leading-tight"
        style={{
          width: 96,
          height: 96,
          background: '#0E7AA4',
          border: '3px solid #0E7AA4',
          color: '#ffffff',
          fontSize: 13,
          padding: 8,
          boxShadow: '0 2px 12px rgba(14,122,164,0.35)',
          overflow: 'visible',
          zIndex: 10,
        }}
      >
        {data.label}
      </div>
    </>
  )
}

function RelatedNodeComponent({ data }: NodeProps<Node<RelatedNodeData>>) {
  const isTo = data.direction === 'to'

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
          width: 80,
          height: 80,
          background: isTo ? '#0E7AA4' : '#64a8c0',
          border: `2px solid ${isTo ? '#0E7AA4' : '#64a8c0'}`,
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 600,
          padding: 8,
          overflow: 'visible',
          zIndex: 5,
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
    const radius = 130
    const nodes: Node[] = [
      {
        id: 'center',
        type: 'center',
        position: { x: 0, y: 0 },
        data: { label: concept.name },
        draggable: false,
        selectable: false,
        zIndex: 10,
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
        zIndex: 5,
      })

      const isTo = rel.direction === 'to'
      const edgeColor = isTo ? '#0E7AA4' : '#94a3b8'

      edges.push({
        id: `edge-${rel.concept.id}`,
        source: isTo ? 'center' : nodeId,
        target: isTo ? nodeId : 'center',
        type: 'straight',
        label: rel.label,
        labelStyle: { fill: '#374151', fontSize: 11, fontWeight: 600 },
        labelBgStyle: { fill: '#f3f4f6' },
        labelBgPadding: [3, 5],
        labelBgBorderRadius: 4,
        style: { stroke: edgeColor, strokeWidth: 2 },
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
      <p className="text-xs text-gray-400">개념 관계 그래프 <span className="text-gray-300">· 드래그/스크롤로 탐색</span></p>
      <div
        className="rounded-xl overflow-hidden border border-gray-200"
        style={{ height: 400 }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodeOrigin={[0.5, 0.5]}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          minZoom={0.5}
          maxZoom={1.5}
          fitView
          fitViewOptions={{ padding: 0.08 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            color="#e5e7eb"
            gap={24}
            size={1.5}
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>
      </div>
      <div className="space-y-1 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-4 h-px bg-[#0E7AA4] inline-block" />
          <span>이 개념이 이어지는 개념</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-px bg-gray-300 inline-block opacity-60" />
          <span>이 개념의 선행 개념</span>
        </div>
      </div>
    </div>
  )
}
