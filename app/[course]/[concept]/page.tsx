import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getConceptById, courses, Course } from '@/lib/concepts'
import SocratesChat from '@/components/SocratesChat'
import ConceptGraph from '@/components/ConceptGraph'

interface Props {
  params: Promise<{ course: string; concept: string }>
}

export default async function SessionPage({ params }: Props) {
  const { course, concept: conceptId } = await params

  const concept = getConceptById(conceptId)
  if (!concept || concept.course !== course) notFound()

  const courseInfo = courses[course as Course]

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/${course}`} className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">
            ←
          </Link>
          <div>
            <p className="text-xs font-medium" style={{ color: courseInfo.color }}>
              {courseInfo.name}
            </p>
            <h1 className="text-white font-bold">{concept.name}</h1>
          </div>
        </div>
        <div className="text-center">
          <p className="text-zinc-600 text-xs">AI&apos;s</p>
          <p className="text-white font-black text-lg leading-none">TUDY</p>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat */}
        <div className="flex-1 flex flex-col border-r border-zinc-800 overflow-hidden">
          <SocratesChat concept={concept} />
        </div>

        {/* Graph */}
        <div className="w-80 shrink-0 p-6 overflow-y-auto hidden md:block">
          <ConceptGraph concept={concept} />
        </div>
      </div>
    </div>
  )
}
