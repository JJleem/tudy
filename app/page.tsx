import Link from 'next/link'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
    <main className="flex-1 flex flex-col items-center justify-center px-6">
      {/* Character + Logo */}
      <div className="mb-12 text-center">
        <div className="flex justify-center mb-5">
          <img
            src="/img/자산_24x.png"
            alt="HYCU 캐릭터"
            className="w-32 h-32 object-contain"
          />
        </div>
        <p className="text-[#0E7AA4] text-xs font-semibold tracking-widest mb-1">AI&apos;s</p>
        <h1 className="text-6xl font-black text-gray-900 tracking-tight">TUDY</h1>
        <p className="text-gray-400 text-sm mt-3">소크라테스식 CS 개념 학습</p>
      </div>

      {/* Course cards */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <Link
          href="/algorithm"
          className="flex-1 rounded-2xl border border-gray-200 bg-white p-8 hover:border-[#0E7AA4] hover:shadow-md transition-all"
        >
          <p className="text-[#0E7AA4] text-xs font-semibold tracking-widest mb-3">ALGORITHM</p>
          <h2 className="text-gray-900 text-xl font-bold mb-1">알고리즘실무</h2>
          <p className="text-gray-400 text-sm">시간복잡도, 정렬, 탐색, DP, 그래프</p>
          <div className="mt-6 text-[#0E7AA4] text-sm font-medium">시작하기 →</div>
        </Link>

        <Link
          href="/java"
          className="flex-1 rounded-2xl border border-gray-200 bg-white p-8 hover:border-[#0f766e] hover:shadow-md transition-all"
        >
          <p className="text-[#0f766e] text-xs font-semibold tracking-widest mb-3">JAVA</p>
          <h2 className="text-gray-900 text-xl font-bold mb-1">자바프로그래밍</h2>
          <p className="text-gray-400 text-sm">OOP, 상속, 컬렉션, 예외처리, 스레드</p>
          <div className="mt-6 text-[#0f766e] text-sm font-medium">시작하기 →</div>
        </Link>
      </div>

      <p className="mt-12 text-gray-300 text-xs">
        개념을 선택하면 AI가 질문을 던집니다. 설명할수록 이해가 깊어집니다.
      </p>
    </main>
    <Footer />
    </div>
  )
}
