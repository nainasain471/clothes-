import { useState } from 'react'
import { apiRequest } from '../services/api'

function Newsletter() {
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setSubmitting(true)
    const form = event.currentTarget
    const formData = new FormData(form)
    try {
      const result = await apiRequest('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: formData.get('email') }),
      })
      setMessage(result.message)
      form.reset()
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-[#f6f0e8] px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">

        <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#6f6258]">
          Notes from ZELIA
        </p>

        <h2 className="text-4xl font-normal text-[#2b211b] md:text-5xl">
          A considered inbox.
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#6f6258]">
          A little inspiration, new arrivals, and occasional notes from our
          world.
        </p>

        <form
          className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name="email"
            aria-label="Email address"
            required
            placeholder="Enter your email address"
            className="min-h-12 flex-1 border border-[#e3d8cc] bg-white px-4 text-sm outline-none focus:border-[#6b4f3a]"
          />

          <button
            type="submit"
            disabled={submitting}
            className="min-h-12 bg-[#6b4f3a] px-7 text-[10px] font-medium tracking-[0.15em] text-white transition-colors hover:bg-[#b98b67] disabled:opacity-60"
          >
            {submitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
          </button>
        </form>

        <p className="mt-4 min-h-5 text-xs text-[#6f6258]" aria-live="polite">
          {message}
        </p>
      </div>
    </section>
  )
}

export default Newsletter