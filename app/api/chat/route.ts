import Anthropic from '@anthropic-ai/sdk'
import { getSocratesSystemPrompt } from '@/lib/prompts'
import { getConceptById, courses } from '@/lib/concepts'

const client = new Anthropic()

export async function POST(req: Request) {
  const { messages, conceptId, course } = await req.json()

  const concept = getConceptById(conceptId)
  if (!concept) {
    return new Response('Concept not found', { status: 404 })
  }

  const courseName = courses[course as keyof typeof courses]?.name ?? course
  const system = getSocratesSystemPrompt(concept, courseName)

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system,
    messages,
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
