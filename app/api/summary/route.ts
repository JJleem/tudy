import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const SUMMARY_SYSTEM = `학습 대화를 분석하여 아래 마크다운 형식으로 요약하세요. 다른 말은 쓰지 마세요.

## ✅ 이해한 개념
- (이해한 내용을 bullet로 정리)

## ❌ 아직 부족한 부분
- (부족하거나 틀렸던 내용을 bullet로 정리)

## 💡 핵심 포인트
1. ...
2. ...
3. ...

## 🎯 종합 이해도 점수
XX / 100`

export async function POST(req: Request) {
  const { messages, conceptName } = await req.json()

  const conversation = messages
    .map((m: { role: string; content: string }) =>
      `[${m.role === 'user' ? '학생' : 'AI 튜터'}]: ${m.content}`
    )
    .join('\n\n')

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SUMMARY_SYSTEM,
    messages: [
      {
        role: 'user',
        content: `"${conceptName}" 학습 대화:\n\n${conversation}`,
      },
    ],
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
            )
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
