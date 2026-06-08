'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Concept, courses } from '@/lib/concepts'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  concept: Concept
}

export default function SocratesChat({ concept }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const courseColor = courses[concept.course].color

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function startSession() {
    setStarted(true)
    setLoading(true)
    await sendToAPI([{ role: 'user', content: '세션을 시작해주세요.' }], true)
  }

  async function sendToAPI(msgs: Message[], isStart = false) {
    setLoading(true)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: msgs,
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

    setMessages(prev => [...(isStart ? [] : prev), { role: 'assistant', content: '' }])

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
            next[next.length - 1] = { role: 'assistant', content: aiText }
            return next
          })
        } catch {
          // ignore parse errors
        }
      }
    }

    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    await sendToAPI(newMessages)
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${courseColor}22`, border: `2px solid ${courseColor}` }}
        >
          🎓
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">{concept.name}</h2>
          <p className="text-zinc-400 text-sm">{concept.description}</p>
        </div>
        <p className="text-zinc-500 text-sm max-w-xs">
          AI가 질문을 던지면, 직접 개념을 설명해보세요.
          설명할수록 이해도가 깊어집니다.
        </p>
        <button
          onClick={startSession}
          className="px-8 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: courseColor }}
        >
          세션 시작
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-zinc-700 text-white rounded-br-sm whitespace-pre-wrap'
                  : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
              }`}
            >
              {msg.content ? (
                msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li>{children}</li>,
                      code: ({ children }) => <code className="bg-zinc-700 px-1 rounded text-xs font-mono">{children}</code>,
                      h1: ({ children }) => <h1 className="font-bold text-base mb-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="font-bold mb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="font-semibold mb-1">{children}</h3>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )
              ) : (
                <span className="inline-flex gap-1">
                  <span className="animate-bounce">·</span>
                  <span className="animate-bounce [animation-delay:0.1s]">·</span>
                  <span className="animate-bounce [animation-delay:0.2s]">·</span>
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="개념을 설명해보세요..."
            disabled={loading}
            className="flex-1 bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 disabled:opacity-50 placeholder-zinc-500"
            style={{ '--tw-ring-color': courseColor } as React.CSSProperties}
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
