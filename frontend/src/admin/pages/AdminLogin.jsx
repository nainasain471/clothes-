import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { user, loading, signInAsAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return <div className="admin-loading">Checking session...</div>
  }
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signInAsAdmin({ email, password })
      navigate('/admin', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <a href="/" className="admin-login-brand" aria-label="ZELIA storefront">
          ZELIA <span>ADMIN</span>
        </a>
        <p className="admin-login-eyebrow">STORE MANAGEMENT</p>
        <h1>Welcome back</h1>
        <p className="admin-login-description">
          Sign in with the administrator account configured for this store.
        </p>
        {error && <div className="admin-alert" role="alert">{error}</div>}
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            <span>Email address</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button type="submit" className="admin-primary-button" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in securely'}
          </button>
        </form>
        <a href="/" className="admin-login-back">Back to ZELIA storefront</a>
      </div>
    </main>
  )
}
