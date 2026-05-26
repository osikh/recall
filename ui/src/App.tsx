import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Documents from './pages/Documents'
import Query from './pages/Query'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/documents" replace />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/query" element={<Query />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
