import { Upload } from 'lucide-react'
import { useRef, useState } from 'react'

interface Props {
  onUpload: (files: File[]) => void
  uploading: boolean
}

export default function UploadDropzone({ onUpload, uploading }: Props) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length) onUpload(files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length) onUpload(files)
    e.target.value = ''
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-3 p-10 rounded-xl border-2 border-dashed cursor-pointer select-none transition-all ${
        dragging
          ? 'border-indigo-400 bg-indigo-50/60'
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
      } ${uploading ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${
          dragging ? 'bg-indigo-100' : 'bg-slate-100'
        }`}
      >
        <Upload className={`w-5 h-5 ${dragging ? 'text-indigo-600' : 'text-slate-400'}`} />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">
          {uploading ? 'Uploading…' : 'Drop files here or click to browse'}
        </p>
        <p className="text-xs text-slate-400 mt-1">PDF, Markdown, TXT</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
        accept=".pdf,.md,.txt,.markdown"
      />
    </div>
  )
}
