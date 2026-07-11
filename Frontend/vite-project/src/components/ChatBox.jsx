import { useState, useEffect, useRef } from 'react'
import { sendMessage, getChatHistory } from '../services/api'

export default function ChatBox({ documentId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Chat history load karo
  useEffect(() => {
    getChatHistory(documentId)
      .then(res => setMessages(res.data.messages))
      .catch(console.error)
  }, [documentId])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    // User message turant dikhao
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }])

    setLoading(true)

    try {
      const { data } = await sendMessage({
        message: userMessage,
        documentId
      })

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      }])

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Kuch error aa gaya, dobara try karo',
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px]">

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-3">💬</div>
            <p>Document ke baare mein kuch poochho!</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                     style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                     style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                     style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Document ke baare mein kuch poochho..."
            disabled={loading}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       disabled:bg-gray-50 transition text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 
                       text-white px-5 py-3 rounded-xl transition font-medium"
          >
            Send →
          </button>
        </div>
      </div>
    </div>
  )
}