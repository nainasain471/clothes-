import { Link } from 'react-router-dom'

function ShopWomen() {
  return (
    <section className="bg-white px-4 py-8 sm:px-6 md:px-10 lg:px-16">
      <div className="grid grid-cols-1 md:min-h-[550px] md:grid-cols-2">

        {/* LEFT SIDE - IMAGE + TEXT */}
        <div className="relative min-h-[420px] overflow-hidden bg-white sm:min-h-[500px] md:min-h-[550px]">

          <Link
            to="/product/5"
            aria-label="View Flowy Midi Dress"
            className="group absolute inset-0 z-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
          >
            <img
              src="/images/products/5.jpg"
              alt="Zelia Women Collection"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Dark overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[#2b211b]/35" />

          {/* Text */}
          <div className="pointer-events-none relative z-10 flex h-full items-center justify-center px-5 py-12 text-center text-white sm:px-8 sm:py-16">
            <div>

              <p className="mb-4 text-[10px] uppercase tracking-[0.24em]">
                ZELIA / Womenswear
              </p>

              <h2 className="text-4xl font-normal tracking-tight min-[380px]:text-5xl md:text-7xl">
                A softer kind of bold.
              </h2>

              <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/90">
                Modern shapes and considered details for your everyday.
              </p>

              <Link
                to="/women"
                className="pointer-events-auto mt-9 inline-block bg-[#6b4f3a] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#b98b67]"
              >
                SHOP WOMEN
              </Link>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE - SECOND IMAGE */}
        <div className="relative min-h-[360px] overflow-hidden bg-white sm:min-h-[420px] md:min-h-[550px]">

          <Link
            to="/product/6"
            aria-label="View Relaxed Everyday Top"
            className="group absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#6b4f3a]"
          >
            <img
              src="/images/products/6.jpg"
              alt="Zelia Women Fashion"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </Link>

        </div>

      </div>
    </section>
  )
}

export default ShopWomen