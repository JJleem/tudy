import Link from 'next/link'
import { notFound } from 'next/navigation'
import { concepts, courses, Course } from '@/lib/concepts'
import Footer from '@/components/Footer'
import ConceptCard from '@/components/ConceptCard'
import CourseProgressBadge from '@/components/CourseProgressBadge'

interface Props {
  params: Promise<{ course: string }>
}

export default async function CoursePage({ params }: Props) {
  const { course } = await params

  if (course !== 'algorithm' && course !== 'java') notFound()

  const courseInfo = courses[course as Course]
  const courseConcepts = concepts.filter(c => c.course === course)
  const conceptIds = courseConcepts.map(c => c.id)

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
          <p className="text-gray-400 text-sm mt-2 mb-4">공부할 개념을 선택하세요</p>
          <CourseProgressBadge conceptIds={conceptIds} color={courseInfo.color} variant="header" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {courseConcepts.map(concept => (
            <ConceptCard
              key={concept.id}
              concept={concept}
              courseColor={courseInfo.color}
              course={course}
            />
          ))}
        </div>
      </div>
    </main>
    <Footer />
    </div>
  )
}
