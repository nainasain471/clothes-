import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const slides = [
  {
    image: '/images/hero1.jpg',
    imageAlt: 'A curated rack of neutral everyday clothing',
    subtitle: 'ZELIA / The considered wardrobe',
    title: 'A little more intentional.',
    text: 'Thoughtful layers and versatile essentials for wherever the day takes you.',
    buttonText: 'Discover the collection',
    link: '/shop',
  },
  {
    image: '/images/hero2.jpg',
    imageAlt: 'Customers browsing clothing in a boutique',
    subtitle: 'ZELIA / Made to be worn',
    title: 'Easy layers. Every day.',
    text: 'Relaxed shapes and considered details, ready for wherever you are headed.',
    buttonText: 'Explore menswear',
    link: '/men',
  },
  {
    image: '/images/hero3.jpg',
    imageAlt: 'A model wearing a printed scarf',
    subtitle: 'ZELIA / A softer point of view',
    title: 'Ease in every detail.',
    text: 'Versatile shapes and thoughtful essentials for wherever the day leads.',
    buttonText: 'Explore womenswear',
    link: '/women',
  },
]

const SLIDE_TIME = 5000
const RING_SIZE = 18
const RING_RADIUS = 7
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [touchStart, setTouchStart] = useState(null)

  const goTo = (index) => setCurrent((index + slides.length) % slides.length)

  // Auto slide: har slide badalne par timer naye sire se shuru hota hai
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, SLIDE_TIME)

    return () => clearTimeout(timer)
  }, [current])

  // Mobile swipe
  const handleTouchEnd = (event) => {
    if (touchStart === null) return

    const diff = touchStart - event.changedTouches[0].clientX

    if (diff > 50) goTo(current + 1)
    if (diff < -50) goTo(current - 1)

    setTouchStart(null)
  }

  return (
    <section
      className="relative h-[min(78vh,560px)] min-h-[480px] w-full overflow-hidden bg-[#f6f0e8] sm:h-[620px] sm:min-h-0 md:h-[min(78vh,850px)] md:min-h-[620px]"
      onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress ring animation */}
      <style>{`
        @keyframes heroRing {
          from { stroke-dashoffset: ${RING_LENGTH}; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Slides (side se sarakti hain) */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            aria-hidden={index !== current}
            className="relative h-full w-full shrink-0"
          >
            <img
              src={slide.image}
              alt={slide.imageAlt}
              className="absolute inset-0 h-full w-full object-cover object-center"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />

            {/* Halka dark overlay taaki text saaf dikhe */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2b211b]/70 via-[#2b211b]/25 to-transparent" />

            {/* Text (left side) */}
            <div className="absolute inset-0 flex items-center px-5 sm:px-6 md:px-12 lg:px-20">
              <div className="max-w-2xl text-white">
                <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] md:text-xs">
                  {slide.subtitle}
                </p>

                <h1 className="max-w-xl font-serif text-4xl font-normal leading-[1.04] tracking-[-0.03em] min-[380px]:text-5xl sm:text-6xl md:text-7xl">
                  {slide.title}
                </h1>

                <p className="mt-4 max-w-md text-sm leading-6 text-white/90 sm:mt-6 sm:leading-7 md:text-base">
                  {slide.text}
                </p>

                <Link
                  to={slide.link}
                  tabIndex={index === current ? 0 : -1}
                  className="mt-6 inline-block border border-[#6b4f3a] bg-[#6b4f3a] px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:border-[#b98b67] hover:bg-[#b98b67] hover:text-white sm:mt-8 sm:px-7 sm:py-4"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots (active dot ek ring hai jo dheere bharti hai) */}
      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goTo(index)}
            className="flex items-center justify-center"
            style={{ width: RING_SIZE, height: RING_SIZE }}
          >
            {index === current ? (
              <svg
                width={RING_SIZE}
                height={RING_SIZE}
                viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                className="-rotate-90"
              >
                <circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  fill="none"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="2"
                />
                <circle
                  key={current}
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray={RING_LENGTH}
                  style={{
                    animation: `heroRing ${SLIDE_TIME}ms linear forwards`,
                  }}
                />
              </svg>
            ) : (
              <span className="block h-3.5 w-3.5 rounded-full bg-white" />
            )}
          </button>
        ))}
      </div>
    </section>
  )
}

export default HeroSection