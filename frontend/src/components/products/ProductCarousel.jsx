import ProductCard from './ProductCard'

function ProductCarousel({ products = [] }) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-3 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {products.map((product) => (
        <div
          key={product.id}
          className="w-full shrink-0 snap-start sm:w-[calc(50%-5px)] md:w-[calc(33.333%-6.667px)] lg:w-[calc(25%-7.5px)]"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

export default ProductCarousel