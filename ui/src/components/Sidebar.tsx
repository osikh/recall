import { BookOpen, FileText, MessageSquare } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/query', icon: MessageSquare, label: 'Ask' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 flex flex-col bg-white border-r border-slate-200">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-600">
          <BookOpen className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
        <span className="font-semibold text-slate-900 tracking-tight">Recall</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">v0.1.0</p>
      </div>
    </aside>
  )
}
