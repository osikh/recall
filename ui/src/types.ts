export type DocumentStatus = 'queued' | 'processing' | 'ready' | 'failed'

export interface DocumentListItem {
  document_id: string
  filename: string
  status: DocumentStatus
  chunk_count: number
  created_at: string
}

export interface Citation {
  document_id: string
  chunk_id: string
  score: number
  snippet: string
  page?: number
}

export interface QueryResponse {
  answer: string
  citations: Citation[]
  latency_ms: number
}
