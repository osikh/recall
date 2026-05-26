import type { DocumentStatus } from '../types'

const styles: Record<DocumentStatus, string> = {
  queued: 'bg-slate-100 text-slate-500',
  processing: 'bg-amber-50 text-amber-700',
  ready: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-red-50 text-red-600',
}

const dots: Record<DocumentStatus, string> = {
  queued: 'bg-slate-400',
  processing: 'bg-amber-400 animate-pulse',
  ready: 'bg-emerald-500',
  failed: 'bg-red-500',
}

export default function StatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  )
}
