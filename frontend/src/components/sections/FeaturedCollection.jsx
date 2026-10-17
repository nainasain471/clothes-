import { Link } from 'react-router-dom'

function FeaturedCollection() {
  return (
    <section className="px-3 py-8 sm:px-6 md:px-10 lg:px-16">
      <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-[#2b211b] sm:min-h-[360px] md:min-h-[420px] lg:min-h-[600px]">
        <img
          src="/images/hero1.jpg"
          alt="A considered edit of versatile wardrobe essentials"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#2b211b]/45" />
        
        <div className="relative z-10 px-4 py-8 text-center text-white sm:px-6">
          <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-white/80">
            The ZELIA point of view
          </p>

          <h2 className="text-4xl font-normal tracking-tight min-[380px]:text-5xl md:text-7xl">
            Less, but better.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/90 md:text-base">
            Thoughtful layers and dependable essentials, chosen to work hard
            and wear beautifully.
          </p>

          <Link
            to="/shop"
            className="mt-9 inline-block border border-[#6b4f3a] bg-[#6b4f3a] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:border-[#b98b67] hover:bg-[#b98b67]"
          >
            SHOP COLLECTION
          </Link>
        </div>

      </div>
    </section>
  )
}

export default FeaturedCollection