import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const formData = new FormData(event.currentTarget)
    const password = formData.get('password')
    if (password !== formData.get('confirmPassword')) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)
    try {
      await signUp({
        name: formData.get('name'),
        email: formData.get('email'),
        password,
      })
      navigate('/account', { replace: true })
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
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">Join ZELIA</p>
          <h1 className="text-3xl font-medium min-[380px]:text-4xl md:text-5xl">Create Account</h1>
          <p className="mt-4 text-sm text-gray-500">Create your ZELIA account and start shopping.</p>
        </div>

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="register-name" className="mb-2 block text-sm">Full Name</label>
            <input id="register-name" name="name" type="text" autoComplete="name" required
              placeholder="Enter your full name"
              className="h-12 w-full border border-[#e3d8cc] px-4 text-sm outline-none focus:border-[#6b4f3a]" />
          </div>
          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm">Email Address</label>
            <input id="register-email" name="email" type="email" autoComplete="email" required
              placeholder="Enter your email"
              className="h-12 w-full border border-[#e3d8cc] px-4 text-sm outline-none focus:border-[#6b4f3a]" />
          </div>
          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm">Password</label>
            <input id="register-password" name="password" type="password" minLength="6" autoComplete="new-password" required
              placeholder="Create a password"
              className="h-12 w-full border border-[#e3d8cc] px-4 text-sm outline-none focus:border-[#6b4f3a]" />
          </div>
          <div>
            <label htmlFor="register-confirm-password" className="mb-2 block text-sm">Confirm Password</label>
            <input id="register-confirm-password" name="confirmPassword" type="password" minLength="6" autoComplete="new-password" required
              placeholder="Confirm your password"
              className="h-12 w-full border border-[#e3d8cc] px-4 text-sm outline-none focus:border-[#6b4f3a]" />
          </div>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={submitting}
            className="h-12 w-full bg-[#6b4f3a] text-sm text-white transition-colors hover:bg-[#b98b67] disabled:opacity-60">
            {submitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-10 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">Already have an account?</p>
          <Link to="/login" className="mt-3 inline-block border border-[#6b4f3a] px-8 py-3 text-xs text-[#6b4f3a] transition-colors hover:border-[#b98b67] hover:bg-[#b98b67] hover:text-white">
            SIGN IN
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
