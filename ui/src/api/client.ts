import type { DocumentListItem, QueryResponse } from '../types'

const BASE = '/api/v1'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, init)
  if (!res.ok) {
    const text = await res.text().catch(() => 'unknown error')
    throw new Error(`${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  documents: {
    list: () => request<DocumentListItem[]>('/documents'),

    upload: (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return request<{ document_id: string; job_id: string; status: string }>('/documents', {
        method: 'POST',
        body: fd,
      })
    },

    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${BASE}/documents/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error(`${res.status}`)
    },
  },

  query: (question: string, topK = 5) =>
    request<QueryResponse>('/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, top_k: topK }),
    }),
}
