import { Send } from 'lucide-react'
import { useState } from 'react'
import { api } from '../api/client'
import type { QueryResponse } from '../types'

export default function Query() {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState<QueryResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    const q = question.trim()
    if (!q || loading) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      setResult(await api.query(q))
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Ask</h1>
        <p className="text-sm text-slate-500 mt-1">
          Ask a question across your documents. Get an answer with citations.
        </p>
      </div>

      <div className="relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={onKeyDown}
          rows={3}
          placeholder="What does the document say about…"
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-14 text-sm shadow-sm placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
        />
        <button
          onClick={submit}
          disabled={!question.trim() || loading}
          className="absolute bottom-3 right-3 flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-xs text-slate-400 -mt-4">⌘ Enter to submit</p>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
          Thinking…
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {result.answer}
            </p>
          </div>

          {result.citations.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Sources
              </p>
              <div className="space-y-2">
                {result.citations.map((c, i) => (
                  <div
                    key={c.chunk_id ?? i}
                    className="p-3.5 bg-white rounded-lg border border-slate-200 text-xs"
                  >
                    <p className="text-slate-600 line-clamp-3 leading-relaxed">{c.snippet}</p>
                    <div className="flex items-center gap-3 mt-2 text-slate-400">
                      <span className="font-medium text-indigo-500">
                        {(c.score * 100).toFixed(0)}% match
                      </span>
                      {c.page != null && <span>Page {c.page}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400">Answered in {result.latency_ms}ms</p>
        </div>
      )}
    </div>
  )
}
