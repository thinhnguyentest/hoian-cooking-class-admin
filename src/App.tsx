import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './features/dashboard/Dashboard'
import ContentManager from './features/content/ContentManager'
import MediaManager from './features/media/MediaManager'
import ContactSettings from './features/settings/components/ContactSettings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="media" element={<MediaManager />} />
          <Route path="settings" element={<ContactSettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
