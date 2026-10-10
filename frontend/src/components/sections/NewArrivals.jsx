import { Link } from 'react-router-dom'
import ProductCarousel from '../products/ProductCarousel'
import { useProducts } from '../../context/ProductsContext'

function NewArrivals() {
  const { products } = useProducts()
  const newProducts = products.slice(-6).reverse()

  return (
    <section className="bg-[#f6f0e8] px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-16">
      <div className="mb-9 flex items-end justify-between border-b border-[#e3d8cc] pb-6">
        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#6f6258]">
            New this week
          </p>

          <h2 className="text-4xl font-normal tracking-tight text-[#2b211b] md:text-5xl">
            Fresh perspective
          </h2>
        </div>

        <Link
          to="/new-arrivals"
          className="hidden border-b border-[#6b4f3a] pb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#6b4f3a] transition-colors hover:border-[#b98b67] hover:text-[#b98b67] sm:block"
        >
          View all
        </Link>
      </div>

      <ProductCarousel products={newProducts} />
    </section>
  )
}

export default NewArrivals