import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/products/ProductCard'
import ProductFilters from '../components/products/ProductFilters'
import filterProducts from '../components/products/filterProducts'
import { useProducts } from '../context/ProductsContext'

function Search() {
  const { products } = useProducts()
  const [searchParams] = useSearchParams()
  const gender = searchParams.get('gender')
  const scopedProducts = gender
    ? products.filter((product) => product.gender === gender)
    : products
  const [search, setSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: '',
    maxPrice: '',
    size: '',
    color: '',
    showOutOfStock: false,
  })
  const queryWords = search
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  const queryProducts = scopedProducts.filter((product) => {
    const productWords = `${product.name} ${product.category} ${product.gender}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)

    return queryWords.every((queryWord) =>
      productWords.some((productWord) =>
        productWord.startsWith(queryWord) || queryWord.startsWith(productWord),
      ),
    )
  })
  const matchingProducts = filterProducts(queryProducts, filters)

  const selectSuggestion = (productName) => {
    setSearch(productName)
    setShowSuggestions(false)
  }

  return (
    <div className="min-h-screen bg-[#f6f0e8]">
      <div className="px-4 py-12 text-center sm:px-6 sm:py-16 md:px-10 lg:px-16">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#6f6258]">
          ZELIA Search
        </p>

        <h1 className="text-3xl font-medium text-[#2b211b] min-[380px]:text-4xl md:text-6xl">
          Search
        </h1>

        <form
          className="relative mx-auto mt-8 flex max-w-xl border-b border-[#6b4f3a]"
          onSubmit={(event) => {
            event.preventDefault()
            setShowSuggestions(false)
          }}
        >
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setShowSuggestions(false)
            }}
            placeholder="Search products..."
            aria-label="Search products"
            aria-expanded={showSuggestions && queryWords.length > 0}
            aria-controls="search-suggestions"
            autoComplete="off"
            className="min-h-12 flex-1 bg-transparent px-2 text-sm text-[#2b211b] outline-none placeholder:text-[#6f6258]"
          />

          <button
            type="submit"
            className="px-4 text-sm font-medium text-[#2b211b] transition-colors hover:text-[#b98b67]"
          >
            SEARCH
          </button>

          {showSuggestions && queryWords.length > 0 && queryProducts.length > 0 && (
            <ul
              id="search-suggestions"
              role="listbox"
              className="absolute left-0 right-0 top-full z-20 border border-[#e3d8cc] bg-white text-left shadow-lg"
            >
              {queryProducts.slice(0, 5).map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected="false"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectSuggestion(product.name)}
                    className="w-full px-4 py-3 text-left text-sm text-[#2b211b] transition-colors hover:bg-[#f6f0e8]"
                  >
                    {product.name}
                    <span className="ml-2 text-xs text-[#6f6258]">
                      {product.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

      <div className="px-4 pb-12 sm:px-6 sm:pb-20 md:px-10 lg:px-16">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-y border-[#e3d8cc] py-3">
          <button
            type="button"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="text-sm font-medium text-[#2b211b] hover:text-[#b98b67] lg:hidden"
          >
            Filter {filtersOpen ? '⌃' : '⌄'}
          </button>
          <p className="text-sm text-[#6f6258]">
          {search.trim()
            ? matchingProducts.length
              ? `${matchingProducts.length} result${matchingProducts.length === 1 ? '' : 's'} for "${search}"`
              : `No products found for "${search}"`
            : 'Explore our collection'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
          <ProductFilters
            products={queryProducts}
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={filtersOpen}
          />

          {matchingProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {matchingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            search.trim() && (
              <p className="text-sm text-[#6f6258]">
                Try a product type like denim, skirt, jeans, shirt, or dress.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
