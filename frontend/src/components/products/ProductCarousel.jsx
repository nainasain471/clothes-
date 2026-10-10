import ProductCard from './ProductCard'

function ProductCarousel({ products = [] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
      {products.map((product) => (
        <div
          key={product.id}
          className="
            w-full
            shrink-0
            snap-start

            sm:w-[calc(50%-6px)]

            lg:w-[calc(25%-9px)]
          "
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

export default ProductCarousel