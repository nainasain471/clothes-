import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)
    try {
      await signIn({
        email: formData.get('email'),
        password: formData.get('password'),
      })
      navigate(location.state?.from || '/account', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f0e8] px-4 py-10 sm:px-6 sm:py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">Welcome Back</p>
          <h1 className="text-3xl font-medium min-[380px]:text-4xl md:text-5xl">Sign In</h1>
          <p className="mt-4 text-sm text-gray-500">Sign in to your ZELIA account.</p>
        </div>

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm">Email Address</label>
            <input id="login-email" name="email" type="email" autoComplete="email" required
              placeholder="Enter your email"
              className="h-12 w-full border border-[#e3d8cc] px-4 text-sm outline-none focus:border-[#6b4f3a]" />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm">Password</label>
            <input id="login-password" name="password" type="password" autoComplete="current-password" required
              placeholder="Enter your password"
              className="h-12 w-full border border-[#e3d8cc] px-4 text-sm outline-none focus:border-[#6b4f3a]" />
          </div>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={submitting}
            className="h-12 w-full bg-[#6b4f3a] text-sm text-white transition-colors hover:bg-[#b98b67] disabled:opacity-60">
            {submitting ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-10 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">Don't have an account?</p>
          <Link to="/register" className="mt-3 inline-block border border-[#6b4f3a] px-8 py-3 text-xs text-[#6b4f3a] transition-colors hover:border-[#b98b67] hover:bg-[#b98b67] hover:text-white">
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
