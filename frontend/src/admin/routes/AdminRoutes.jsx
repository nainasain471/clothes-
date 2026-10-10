import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import Admin from '../../pages/Admin'
import AdminLogin from '../pages/AdminLogin'

function ProtectedDashboard() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="admin-loading">Checking administrator access...</div>
  }
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }
  if (user.role !== 'admin') {
    return (
      <main className="admin-access-block">
        <section className="admin-access-card">
          <h1>Administrator access required</h1>
          <p>This account is not authorized to manage the ZELIA store.</p>
          <a className="admin-link-button" href="/">Return to store</a>
        </section>
      </main>
    )
  }
  return <Admin />
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="*" element={<ProtectedDashboard />} />
    </Routes>
  )
}
