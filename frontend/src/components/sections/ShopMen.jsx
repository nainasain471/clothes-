import { Link } from 'react-router-dom'

function ShopMen() {
  return (
    <section className="bg-white px-3 py-6 sm:px-6 md:px-10 lg:px-16">
      <div className="grid grid-cols-1 gap-3 lg:min-h-[550px] lg:grid-cols-2">

        <div className="relative min-h-[280px] overflow-hidden bg-white sm:min-h-[340px] lg:min-h-[550px]">
          <Link
            to="/product/2"
            aria-label="View Relaxed Fit Shirt"
            className="group absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#6b4f3a]"
          >
            <img
              src="/images/products/2.jpg"
              alt="ZELIA men's collection"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </Link>
        </div>

        <div className="relative min-h-[300px] overflow-hidden bg-white sm:min-h-[360px] lg:min-h-[550px]">
          <Link
            to="/product/1"
            aria-label="View Essential Cotton T-Shirt"
            className="group absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
          >
            <img
              src="/images/products/1.jpg"
              alt="ZELIA men's graphic T-shirt"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </Link>
          <div className="pointer-events-none absolute inset-0 bg-[#2b211b]/40" />

          <div className="pointer-events-none relative z-10 flex h-full items-center justify-center px-5 py-12 text-center text-white sm:px-8 sm:py-16">
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[0.24em]">
                ZELIA / Menswear
              </p>

              <h2 className="text-4xl font-normal tracking-tight min-[380px]:text-5xl md:text-7xl">
                Built to go further.
              </h2>

              <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/90">
                Considered essentials for the rhythm of every day.
              </p>

              <Link
                to="/men"
                className="pointer-events-auto mt-9 inline-block bg-[#6b4f3a] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#b98b67]"
              >
                SHOP MEN
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default ShopMen