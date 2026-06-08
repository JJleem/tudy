import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-16 text-center">
        <p className="text-zinc-500 text-sm tracking-widest mb-1">AI&apos;s</p>
        <h1 className="text-7xl font-black text-white tracking-tight">TUDY</h1>
        <p className="text-zinc-600 text-sm mt-3">소크라테스식 CS 개념 학습</p>
      </div>

      {/* Course cards */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <Link
          href="/algorithm"
          className="flex-1 group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-8 hover:border-indigo-500 transition-colors"
        >
          <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-5 transition-opacity" />
          <p className="text-indigo-400 text-xs font-medium tracking-widest mb-3">ALGORITHM</p>
          <h2 className="text-white text-xl font-bold mb-1">알고리즘실무</h2>
          <p className="text-zinc-500 text-sm">시간복잡도, 정렬, 탐색, DP, 그래프</p>
          <div className="mt-6 text-indigo-400 text-sm font-medium">시작하기 →</div>
        </Link>

        <Link
          href="/java"
          className="flex-1 group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-8 hover:border-emerald-500 transition-colors"
        >
          <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity" />
          <p className="text-emerald-400 text-xs font-medium tracking-widest mb-3">JAVA</p>
          <h2 className="text-white text-xl font-bold mb-1">자바프로그래밍</h2>
          <p className="text-zinc-500 text-sm">OOP, 상속, 컬렉션, 예외처리, 스레드</p>
          <div className="mt-6 text-emerald-400 text-sm font-medium">시작하기 →</div>
        </Link>
      </div>

      <p className="mt-12 text-zinc-700 text-xs">
        개념을 선택하면 AI가 질문을 던집니다. 설명할수록 이해가 깊어집니다.
      </p>
    </main>
  )
}
