import React from 'react'
import { DashboardLayout } from '../components/layouts'
import { useUIStore } from '../stores'
import { ProtectedRoute } from '../components/common/ProtectedRoute'
import { Menu, Send, Bot, User, Loader2 } from 'lucide-react'
import { consultationAPI } from '../api/endpoints'

const SUGGESTIONS = [
  'Bagaimana cara mengajukan KUR untuk UMKM?',
  'Cara bergabung grup pengadaan di Deschain?',
  'Tips negosiasi harga dengan vendor?',
  'Apa itu credit trail dan manfaatnya?',
  'Regulasi OJK terbaru untuk UMKM?',
  'Strategi pemasaran di TikTok Shop?',
]

function useTypewriter(target, active) {
  const [displayed, setDisplayed] = React.useState('')
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    if (!active || !target) return
    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(target.slice(0, i))
      if (i >= target.length) {
        clearInterval(id)
        setDone(true)
      }
    }, 8)
    return () => clearInterval(id)
  }, [target, active])

  return { displayed, done }
}

function renderMarkdown(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('💡')) {
      return (
        <div key={i} className="mt-2 px-3 py-2 bg-gold-50 border border-gold-200 rounded-lg text-xs text-gold-800">
          {parseInline(line)}
        </div>
      )
    }
    return <p key={i} className={line === '' ? 'h-2' : 'leading-relaxed'}>{parseInline(line)}</p>
  })
}

function parseInline(line) {
  const parts = []
  let rest = line
  let key = 0
  while (rest.length > 0) {
    const bold = rest.match(/^\*\*(.+?)\*\*/)
    const italic = rest.match(/^\*([^*].+?)\*/)
    if (bold) {
      parts.push(<strong key={key++} className="font-semibold text-navy-900">{bold[1]}</strong>)
      rest = rest.slice(bold[0].length)
    } else if (italic) {
      parts.push(<em key={key++} className="text-gray-500 not-italic text-xs">{italic[1]}</em>)
      rest = rest.slice(italic[0].length)
    } else {
      // Find next potential marker — if at position 0 or not found, dump remaining text
      const next = rest.search(/\*\*|\*/)
      if (next <= 0) {
        parts.push(<span key={key++}>{rest}</span>)
        break
      }
      parts.push(<span key={key++}>{rest.slice(0, next)}</span>)
      rest = rest.slice(next)
    }
  }
  return parts
}

function BotBubble({ text, isLatest }) {
  const { displayed, done } = useTypewriter(text, isLatest)
  const content = isLatest ? displayed : text

  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 bg-navy-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot size={14} className="text-gold-400" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-2xl shadow-sm">
        <div className="text-sm text-gray-800 space-y-0.5">
          {renderMarkdown(content)}
          {isLatest && !done && <span className="inline-block w-1 h-4 bg-navy-900 ml-0.5 animate-pulse align-text-bottom" />}
        </div>
      </div>
    </div>
  )
}

function UserBubble({ text }) {
  return (
    <div className="flex gap-3 items-start justify-end">
      <div className="bg-navy-900 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-lg">
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
      <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <User size={14} className="text-white" />
      </div>
    </div>
  )
}

const Consultation = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const [messages, setMessages] = React.useState([])
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const bottomRef = React.useRef(null)
  const inputRef = React.useRef(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (question) => {
    const q = question || input.trim()
    if (!q || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: q }])
    setLoading(true)
    try {
      const res = await consultationAPI.ask(q)
      if (res.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: res.data.answer, sources: res.data.sources },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Maaf, terjadi kesalahan. Silakan coba lagi.', sources: [] },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const lastBotIdx = messages.reduce((acc, m, i) => m.role === 'bot' ? i : acc, -1)

  return (
    <ProtectedRoute>
      <DashboardLayout sidebarOpen={sidebarOpen} onToggle={toggleSidebar}>
        <div className="flex flex-col h-[calc(100vh-112px)]">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 flex-shrink-0">
            <button onClick={toggleSidebar} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <Menu size={18} className="text-navy-900" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-navy-900">Konsultasi AI</h1>
              <p className="text-gray-400 text-sm">Tanya seputar UMKM, pengadaan, KUR, dan regulasi</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-700 font-medium">Aktif</span>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
                <div className="w-16 h-16 bg-navy-900 rounded-2xl flex items-center justify-center">
                  <Bot size={28} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-navy-900 font-semibold text-lg">Halo! Saya siap membantu</p>
                  <p className="text-gray-400 text-sm mt-1">Tanya apa saja tentang bisnis UMKM Anda</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left text-sm text-navy-900 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gold-400 hover:bg-gold-50 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) =>
              m.role === 'user' ? (
                <UserBubble key={i} text={m.text} />
              ) : (
                <div key={i} className="space-y-1.5">
                  <BotBubble text={m.text} isLatest={i === lastBotIdx} />
                  {m.sources?.length > 0 && (
                    <div className="ml-11 flex flex-wrap gap-1.5">
                      {m.sources.map((src, si) => (
                        <a
                          key={si}
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors truncate max-w-xs"
                        >
                          {new URL(src).hostname}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}

            {loading && (
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-navy-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={14} className="text-gold-400" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <Loader2 size={16} className="text-gray-400 animate-spin" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 pt-2">
            <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-2 shadow-sm focus-within:border-gold-400 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ketik pertanyaan Anda... (Enter untuk kirim)"
                rows={1}
                className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 px-2 py-1 max-h-32 min-h-[36px]"
                style={{ height: 'auto' }}
                onInput={(e) => {
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-navy-900 rounded-xl flex items-center justify-center hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 self-end"
              >
                <Send size={15} className="text-white" />
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Jawaban berdasarkan knowledge base Deschain — bukan nasihat hukum atau keuangan resmi
            </p>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default Consultation
