import Link from 'next/link'
import { notFound } from 'next/navigation'
import { concepts, courses, Course } from '@/lib/concepts'

interface Props {
  params: Promise<{ course: string }>
}

export default async function CoursePage({ params }: Props) {
  const { course } = await params

  if (course !== 'algorithm' && course !== 'java') notFound()

  const courseInfo = courses[course as Course]
  const courseConcepts = concepts.filter(c => c.course === course)
  const isAlgo = course === 'algorithm'

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link href="/" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors mb-8 inline-block">
          ← 홈
        </Link>

        <div className="mb-10">
          <p className="text-xs font-medium tracking-widest mb-2" style={{ color: courseInfo.color }}>
            {isAlgo ? 'ALGORITHM' : 'JAVA'}
          </p>
          <h1 className="text-3xl font-black text-white">{courseInfo.name}</h1>
          <p className="text-zinc-500 text-sm mt-2">공부할 개념을 선택하세요</p>
        </div>

        {/* Concept grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {courseConcepts.map(concept => (
            <Link
              key={concept.id}
              href={`/${course}/${concept.id}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 transition-colors"
            >
              <h3 className="text-white font-semibold mb-1 group-hover:text-white/90">
                {concept.name}
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{concept.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
