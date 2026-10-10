import ProductCarousel from '../products/ProductCarousel'
import { useProducts } from '../../context/ProductsContext'

function BestSellers() {
  const { products } = useProducts()
  const markedBestSellers = products.filter((product) => product.bestseller)
  const bestProducts = markedBestSellers.length
    ? markedBestSellers.slice(0, 6)
    : products.slice(4, 10)

  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-16">
      <div className="mb-9 border-b border-[#e3d8cc] pb-6">
        <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#6f6258]">
          The pieces you return to
        </p>

        <h2 className="text-4xl font-normal text-[#2b211b] md:text-5xl">
          Most loved
        </h2>
      </div>

      <ProductCarousel products={bestProducts} />
    </section>
  )
}

export default BestSellers