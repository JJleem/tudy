export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white py-6 px-6 mt-auto">
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="font-medium text-gray-500">임재준</span>
          <span>·</span>
          <span>2026100427</span>
          <span>·</span>
          <span>컴퓨터공학과</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <a
            href="mailto:leemjaejun@naver.com"
            className="hover:text-[#0E7AA4] transition-colors"
          >
            leemjaejun@naver.com
          </a>
          <span>·</span>
          <a
            href="https://github.com/JJleem"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0E7AA4] transition-colors"
          >
            github.com/JJleem
          </a>
        </div>
      </div>
    </footer>
  )
}
