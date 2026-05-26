import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import DocumentCard from '../components/DocumentCard'
import UploadDropzone from '../components/UploadDropzone'
import type { DocumentListItem } from '../types'

export default function Documents() {
  const [docs, setDocs] = useState<DocumentListItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setDocs(await api.documents.list())
    } catch (err) {
      setError(String(err))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleUpload = async (files: File[]) => {
    setUploading(true)
    setError(null)
    try {
      await Promise.all(files.map((f) => api.documents.upload(f)))
      await load()
    } catch (err) {
      setError(String(err))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.documents.delete(id)
      setDocs((prev) => prev.filter((d) => d.document_id !== id))
    } catch (err) {
      setError(String(err))
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Documents</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload files to build your knowledge base.
        </p>
      </div>

      <UploadDropzone onUpload={handleUpload} uploading={uploading} />

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {docs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-slate-400">No documents yet — upload one above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            {docs.length} {docs.length === 1 ? 'document' : 'documents'}
          </p>
          {docs.map((doc) => (
            <DocumentCard key={doc.document_id} doc={doc} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
