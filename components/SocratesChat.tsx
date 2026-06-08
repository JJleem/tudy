'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Concept, courses } from '@/lib/concepts'

interface Message {
  role: 'user' | 'assistant'
  content: string
  time?: Date
}

interface Props {
  concept: Concept
  onInsight?: (text: string, time: Date) => void
}

function particle(word: string) {
  const code = word.charCodeAt(word.length - 1)
  if (code < 0xAC00 || code > 0xD7A3) return '이'
  return (code - 0xAC00) % 28 !== 0 ? '이' : '가'
}

function TypingFirstMessage({ name }: { name: string }) {
  const suffix = `${particle(name)} 무엇인지 본인의 말로 설명해보세요.`
  const total = name.length + suffix.length
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count >= total) return
    const id = setTimeout(() => setCount(c => c + 1), 35)
    return () => clearTimeout(id)
  }, [count, total])

  const nameTyped = name.slice(0, Math.min(count, name.length))
  const suffixTyped = count > name.length ? suffix.slice(0, count - name.length) : ''

  return (
    <span>
      <strong className="font-bold">{nameTyped}</strong>{suffixTyped}
    </span>
  )
}

function extractInsights(content: string): string[] {
  const results: string[] = []
  const regex = /<div class="feedback-good">([\s\S]*?)<\/div>/g
  let match
  while ((match = regex.exec(content)) !== null) {
    const text = match[1].trim()
    if (text) results.push(text)
  }
  return results
}

function MessageTime({ time, align }: { time?: Date; align: 'left' | 'right' }) {
  if (!time) return null
  return (
    <p className={`text-[10px] mt-1.5 select-none ${align === 'right' ? 'text-white/60 text-right' : 'text-gray-400 text-left'}`}>
      {time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
    </p>
  )
}

const mdComponents = {
  p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
  em: ({ children }: any) => <em className="italic">{children}</em>,
  ul: ({ children }: any) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
  li: ({ children }: any) => <li>{children}</li>,
  h1: ({ children }: any) => <h1 className="font-bold text-base mb-1">{children}</h1>,
  h2: ({ children }: any) => <h2 className="font-bold mb-1">{children}</h2>,
  h3: ({ children }: any) => <h3 className="font-semibold mb-1">{children}</h3>,
  pre: ({ children }: any) => <div className="my-2">{children}</div>,
  code: ({ className, children }: any) => {
    const lang = /language-(\w+)/.exec(className || '')?.[1]
    if (lang) {
      return (
        <SyntaxHighlighter
          language={lang}
          style={vscDarkPlus}
          customStyle={{ borderRadius: '8px', fontSize: '12px', margin: 0, padding: '12px' }}
          PreTag="div"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      )
    }
    return <code className="bg-gray-200 px-1 rounded text-xs font-mono">{children}</code>
  },
}

const defaultMessage = (name: string): Message => ({
  role: 'assistant',
  content: `**${name}**${particle(name)} 무엇인지 본인의 말로 설명해보세요.`,
})

export default function SocratesChat({ concept, onInsight }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [restored, setRestored] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const courseColor = courses[concept.course].color
  const storageKey = `chat_${concept.id}`

  // 초기화: 복원 or 새 시작 — messages가 빈 배열일 때만 동작하므로 저장 effect와 충돌 없음
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(parsed.map((m: Message & { time?: string }) => ({
          ...m,
          time: m.time ? new Date(m.time) : undefined,
        })))
        setRestored(true)
        return
      } catch {}
    }
    setMessages([defaultMessage(concept.name)])
  }, [])

  // 저장 — messages가 실제로 채워진 이후에만 실행됨
  useEffect(() => {
    if (messages.length > 0) localStorage.setItem(storageKey, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendToAPI(msgs: Message[]) {
    setLoading(true)
    const apiMsgs = msgs[0]?.role === 'assistant' ? msgs.slice(1) : msgs
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: apiMsgs.map(({ role, content }) => ({ role, content })),
        conceptId: concept.id,
        course: concept.course,
      }),
    })

    if (!res.ok || !res.body) {
      setLoading(false)
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let aiText = ''
    const aiTime = new Date()

    setMessages(prev => [...prev, { role: 'assistant', content: '', time: aiTime }])

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const lines = decoder.decode(value).split('\n')
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6)
        if (data === '[DONE]') break
        try {
          const { text } = JSON.parse(data)
          aiText += text
          setMessages(prev => {
            const next = [...prev]
            next[next.length - 1] = { role: 'assistant', content: aiText, time: aiTime }
            return next
          })
        } catch {
          // ignore parse errors
        }
      }
    }

    extractInsights(aiText).forEach(text => onInsight?.(text, new Date()))
    const score = /score-box[\s\S]*?(\d{1,3})\s*\/\s*100/.exec(aiText)
    if (score) localStorage.setItem(`score_${concept.id}`, score[1])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input.trim(), time: new Date() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    await sendToAPI(newMessages)
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-gray-300 text-sm">불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <img
                src="/img/01_안녕.png"
                alt="AI"
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-100"
              />
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'text-white rounded-br-sm whitespace-pre-wrap'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
              style={msg.role === 'user' ? { backgroundColor: courseColor } : undefined}
            >
              {msg.content ? (
                msg.role === 'user' ? (
                  <>
                    {msg.content}
                    <MessageTime time={msg.time} align="right" />
                  </>
                ) : i === 0 && !restored ? (
                  <TypingFirstMessage name={concept.name} />
                ) : (
                  <>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} components={mdComponents}>
                      {msg.content}
                    </ReactMarkdown>
                    <MessageTime time={msg.time} align="left" />
                  </>
                )
              ) : (
                <span className="inline-flex gap-1 text-gray-400">
                  <span className="animate-bounce">·</span>
                  <span className="animate-bounce [animation-delay:0.1s]">·</span>
                  <span className="animate-bounce [animation-delay:0.2s]">·</span>
                </span>
              )}
            </div>
            {msg.role === 'user' && (
              <img
                src="/img/thumb-default.svg"
                alt="나"
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200"
              />
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="개념을 설명해보세요..."
            disabled={loading}
            className="flex-1 bg-gray-50 text-gray-900 rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 focus:border-[#0E7AA4] focus:bg-white disabled:opacity-50 placeholder-gray-400 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-3 rounded-xl text-white font-medium text-sm transition-opacity hover:opacity-80 disabled:opacity-30"
            style={{ backgroundColor: courseColor }}
          >
            전송
          </button>
        </div>
      </form>
    </div>
  )
}
