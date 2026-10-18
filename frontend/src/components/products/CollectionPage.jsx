import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import ProductFilters from './ProductFilters'
import filterProducts from './filterProducts'

const categoryShortcuts = {
  all: [
    { label: "MEN'S SHIRTS", to: '/men/category/shirts' },
    { label: "MEN'S PANTS", to: '/men/category/pants' },
    { label: "WOMEN'S TOPS", to: '/women/category/tops' },
    { label: "WOMEN'S BOTTOMS", to: '/women/category/bottoms' },
  ],
  men: [
    { label: "MEN'S SHIRTS", to: '/men/category/shirts' },
    { label: "MEN'S PANTS", to: '/men/category/pants' },
  ],
  women: [
    { label: "WOMEN'S TOPS", to: '/women/category/tops' },
    { label: "WOMEN'S BOTTOMS", to: '/women/category/bottoms' },
  ],
}

function CollectionPage({
  title,
  products,
  gender,
  shortcuts,
  showNewBadge = false,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState('featured')
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: '',
    maxPrice: '',
    size: '',
    color: '',
    showOutOfStock: false,
  })

  const filteredProducts = filterProducts(products, filters)
  const visibleProducts = [...filteredProducts]

  if (sortOrder === 'price-low') {
    visibleProducts.sort((first, second) => first.price - second.price)
  } else if (sortOrder === 'price-high') {
    visibleProducts.sort((first, second) => second.price - first.price)
  } else if (sortOrder === 'name') {
    visibleProducts.sort((first, second) => first.name.localeCompare(second.name))
  }

  return (
    <main className="mx-auto min-h-[60vh] max-w-[1600px] px-3 pb-12 pt-6 min-[380px]:px-4 sm:px-6 sm:pb-20 sm:pt-10 lg:px-10">
      <nav
        aria-label="Shop categories"
        className="mb-7 flex gap-2 overflow-x-auto pb-2 sm:mb-10 sm:gap-3 md:justify-center"
      >
        {(shortcuts ?? categoryShortcuts[gender] ?? categoryShortcuts.all).map((shortcut) => (
          <Link
            key={shortcut.to}
            to={shortcut.to}
            className="shrink-0 bg-white px-4 py-3 text-center text-[10px] font-medium tracking-[0.12em] text-[#2b211b] transition-colors hover:bg-[#b98b67] hover:text-white sm:px-5 sm:tracking-[0.14em]"
          >
            {shortcut.label}
          </Link>
        ))}
      </nav>

      <header className="mb-7 text-center">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#6f6258]">
          The ZELIA collection
        </p>
        <h1 className="text-3xl font-normal tracking-tight text-[#2b211b] min-[380px]:text-4xl md:text-5xl">
          {title}
        </h1>
      </header>

      <div className="mb-4 grid grid-cols-3 items-center border-y border-[#e3d8cc] text-sm text-[#2b211b]">
        <button
          type="button"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="justify-self-start py-3 font-medium hover:opacity-60 lg:hidden"
        >
          <span aria-hidden="true" className="mr-2 text-lg">☷</span>
          Filter
          <span aria-hidden="true" className="ml-2">
            {filtersOpen ? '⌄' : '‹'}
          </span>
        </button>

        <p className="justify-self-center whitespace-nowrap">
          <span className="lg:hidden">{visibleProducts.length}{' '}</span>
          <span className="hidden lg:inline">{visibleProducts.length}{' '}</span>
          {visibleProducts.length === 1 ? 'product' : 'products'}
        </p>

        <label className="justify-self-end">
          <span className="sr-only">Sort products</span>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="max-w-36 cursor-pointer bg-transparent py-3 text-right font-medium outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        <ProductFilters
          products={products}
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={filtersOpen}
        />

        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-8 min-[380px]:gap-x-3 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showNewBadge={showNewBadge}
              />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-[#6f6258]">
            No products found with these filters.
          </p>
        )}
      </div>
    </main>
  )
}

export default CollectionPage
