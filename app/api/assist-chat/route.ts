export const maxDuration = 30

type IncomingMessage = { role: string; content: string }

const RESPONSES = [
  "Hello! I'm HELIX Assist, your AI assistant for construction project management. I can help you with project planning, financial analysis, RFI management, and more. How can I assist you today?",
  "I'd be happy to help with that. Based on your project data, I can provide insights on budget tracking, schedule optimization, and resource allocation.",
  "That's a great question. For construction projects, it's important to maintain clear documentation and communication across all teams. Would you like me to help you set up a workflow for that?",
  "I can analyze your project financials and provide recommendations for cost optimization. Let me know if you'd like me to dive deeper into any specific area.",
  "For BIM coordination, I recommend establishing regular coordination meetings and using clash detection tools to identify conflicts early in the design phase.",
]

let idx = 0

export async function POST(req: Request) {
  const { messages }: { messages: IncomingMessage[] } = await req.json()
  void messages // acknowledged — used for future real AI integration

  const response = RESPONSES[idx % RESPONSES.length]
  idx++

  // Stream plain text word-by-word so the local useChat stub can append chunks directly.
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const words = response.split(" ")
      for (let i = 0; i < words.length; i++) {
        controller.enqueue(encoder.encode((i === 0 ? "" : " ") + words[i]))
        await new Promise((r) => setTimeout(r, 40))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
