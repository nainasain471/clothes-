import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const announcements = [
  {
    text: 'Complimentary delivery on orders over ₹999',
    action: 'Shop now',
    to: '/shop',
  },
  {
    text: "New women's collection now live",
    action: 'Shop now',
    to: '/women',
  },
  {
    text: 'Discover the latest arrivals',
    action: 'Explore now',
    to: '/new-arrivals',
  },
]

const ANNOUNCEMENT_INTERVAL = 5000

function AnnouncementBar() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % announcements.length)
    }, ANNOUNCEMENT_INTERVAL)

    return () => window.clearInterval(timer)
  }, [])

  const announcement = announcements[current]

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="flex min-h-9 items-center justify-center gap-2 bg-[#f6f0e8] px-4 py-2 text-center text-[10px] font-medium tracking-[0.12em] text-[#2b211b] sm:text-xs"
    >
      <span>{announcement.text}</span>
      <Link
        to={announcement.to}
        className="shrink-0 font-semibold uppercase text-[#6b4f3a] underline underline-offset-2 transition-colors hover:text-[#b98b67]"
      >
        {announcement.action}
      </Link>
    </div>
  )
}

export default AnnouncementBar