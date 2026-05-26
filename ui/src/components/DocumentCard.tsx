import { FileText, Trash2 } from 'lucide-react'
import type { DocumentListItem } from '../types'
import StatusBadge from './StatusBadge'

interface Props {
  doc: DocumentListItem
  onDelete: (id: string) => void
}

export default function DocumentCard({ doc, onDelete }: Props) {
  const date = new Date(doc.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="flex items-center gap-4 px-4 py-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group">
      <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-50">
        <FileText className="w-4 h-4 text-indigo-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{doc.filename}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          {doc.chunk_count > 0 ? `${doc.chunk_count} chunks · ` : ''}
          {date}
        </p>
      </div>

      <StatusBadge status={doc.status} />

      <button
        onClick={() => onDelete(doc.document_id)}
        className="shrink-0 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
