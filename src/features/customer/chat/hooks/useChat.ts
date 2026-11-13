import { useEffect, useRef, useState } from 'react'
import { chatError, sendChat } from '../api/chatApi'
import type { ChatMessage, ChatTurn } from '../types/types'

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const request = useRef<AbortController | null>(null)
  const history = useRef<ChatTurn[]>([])

  useEffect(() => () => request.current?.abort(), [])

  async function send(value = draft) {
    const message = value.trim()
    if (!message || message.length > 500 || request.current) return
    const controller = new AbortController()
    request.current = controller
    setPending(true)
    setError('')
    setDraft('')
    setMessages((current) => [...current, { role: 'user', content: message }])
    try {
      const answer = await sendChat(
        sessionId,
        message,
        history.current,
        controller.signal,
      )
      if (controller.signal.aborted) return
      history.current = [
        ...history.current,
        { role: 'user' as const, content: message },
        { role: 'assistant' as const, content: answer.answer.slice(0, 500) },
      ].slice(-4)
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: answer.answer,
          items: answer.items,
          searchLimited: answer.searchLimited,
        },
      ])
    } catch (cause) {
      if (controller.signal.aborted) return
      setError(chatError(cause))
      setDraft(message)
    } finally {
      if (!controller.signal.aborted) {
        setPending(false)
        request.current = null
      }
    }
  }

  return { messages, draft, setDraft, pending, error, send }
}
