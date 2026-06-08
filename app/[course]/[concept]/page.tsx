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
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/${course}`} className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            ←
          </Link>
          <div>
            <p className="text-xs font-semibold" style={{ color: courseInfo.color }}>
              {courseInfo.name}
            </p>
            <h1 className="text-gray-900 font-bold">{concept.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img src="/img/자산_24x.png" alt="HYCU" className="w-7 h-7 object-contain" />
          <div className="text-right">
            <p className="text-[#0E7AA4] text-xs font-medium leading-none">AI&apos;s</p>
            <p className="text-gray-900 font-black text-base leading-none">TUDY</p>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat */}
        <div className="flex-1 flex flex-col border-r border-gray-200 overflow-hidden">
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
