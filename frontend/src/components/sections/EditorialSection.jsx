import { Link } from 'react-router-dom'

function EditorialSection() {
  return (
    <section className="px-3 py-8 sm:px-6 md:px-10 lg:px-16">
      <div className="grid items-center gap-3 bg-[#f6f0e8] lg:min-h-[500px] lg:grid-cols-2">
        <div className="px-4 py-8 text-center sm:px-8 sm:py-12 md:px-12 md:text-left lg:px-20">
          <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[#6f6258]">
            Pieces to live in
          </p>

          <h2 className="text-3xl font-normal leading-tight tracking-tight text-[#2b211b] min-[380px]:text-4xl md:text-6xl">
            A wardrobe that feels like you.
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-[#6f6258]">
            Modern silhouettes, versatile layers and considered essentials
            designed to move with you through the everyday.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-block border border-[#6b4f3a] bg-[#6b4f3a] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:border-[#b98b67] hover:bg-[#b98b67]"
          >
            Shop the collection
          </Link>
        </div>

        <div className="relative min-h-[260px] overflow-hidden bg-white sm:min-h-[360px] lg:min-h-[500px]">
          <img
            src="/images/products/7.jpg"
            alt="A deep green dress from the ZELIA collection"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  )
}

export default EditorialSection