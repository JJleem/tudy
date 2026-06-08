import Link from 'next/link'
import { notFound } from 'next/navigation'
import { concepts, courses, Course } from '@/lib/concepts'
import Footer from '@/components/Footer'

interface Props {
  params: Promise<{ course: string }>
}

export default async function CoursePage({ params }: Props) {
  const { course } = await params

  if (course !== 'algorithm' && course !== 'java') notFound()

  const courseInfo = courses[course as Course]
  const courseConcepts = concepts.filter(c => c.course === course)

  return (
    <div className="min-h-screen bg-white flex flex-col">
    <main className="flex-1 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors mb-8 inline-block">
          ← 홈
        </Link>

        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: courseInfo.color }}>
            {course === 'algorithm' ? 'ALGORITHM' : 'JAVA'}
          </p>
          <h1 className="text-3xl font-black text-gray-900">{courseInfo.name}</h1>
          <p className="text-gray-400 text-sm mt-2">공부할 개념을 선택하세요</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {courseConcepts.map(concept => (
            <Link
              key={concept.id}
              href={`/${course}/${concept.id}`}
              className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-gray-300 transition-all block"
            >
              <div className="w-5 h-0.5 rounded mb-3" style={{ backgroundColor: courseInfo.color }} />
              <h3 className="text-gray-900 font-semibold mb-1">{concept.name}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{concept.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
    <Footer />
    </div>
  )
}
