import { useState } from 'react'

const categoryNames = {
  't-shirts': 'Tees',
  shirts: 'Shirts',
  polos: 'Polos',
  sweaters: 'Sweaters',
  hoodies: 'Sweatshirts',
  jackets: 'Jackets',
  pants: 'Pants',
  shorts: 'Shorts',
  jeans: 'Denim',
  dresses: 'Dresses',
  tops: 'Tops',
  kurtas: 'Kurtas',
  trousers: 'Trousers',
  skirts: 'Skirts',
  'co-ords': 'Co-ords',
}

function ProductFilters({ products, filters, onFiltersChange, isOpen }) {
  const [expanded, setExpanded] = useState({
    category: true,
    price: true,
    size: true,
    colour: true,
  })
  const categories = [...new Set(products.map((product) => product.category))]
  const sizes = [...new Set(products.flatMap((product) => product.sizes ?? []))]
  const colours = [...new Set(products.map((product) => product.color).filter(Boolean))]
  const hasOutOfStockProducts = products.some((product) => product.inStock === false)
  const priceCeiling = Math.max(0, ...products.map((product) => product.price))

  const toggleSection = (section) => {
    setExpanded((current) => ({ ...current, [section]: !current[section] }))
  }

  const toggleCategory = (category) => {
    const selected = filters.categories.includes(category)
    onFiltersChange({
      ...filters,
      categories: selected
        ? filters.categories.filter((item) => item !== category)
        : [...filters.categories, category],
    })
  }

  const sectionButton = (label, section) => (
    <button
      type="button"
      aria-expanded={expanded[section]}
      onClick={() => toggleSection(section)}
      className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-[#2b211b]"
    >
      {label}
      <span aria-hidden="true">{expanded[section] ? '⌃' : '⌄'}</span>
    </button>
  )

  return (
    <aside
      aria-label="Product filters"
      className={`${isOpen ? 'block' : 'hidden'} border-b border-[#e3d8cc] pb-6 lg:block lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#2b211b]">Filters</h2>
        <button
          type="button"
          onClick={() => onFiltersChange({
            categories: [],
            minPrice: '',
            maxPrice: '',
            size: '',
            color: '',
            showOutOfStock: false,
          })}
          className="text-xs text-[#6f6258] underline underline-offset-4 hover:text-[#b98b67]"
        >
          Clear all
        </button>
      </div>

      {hasOutOfStockProducts && (
        <label className="flex items-center justify-between border-b border-[#e3d8cc] py-4 text-sm text-[#2b211b]">
          <span>Show out of stock</span>
          <input
            type="checkbox"
            checked={filters.showOutOfStock}
            onChange={(event) =>
              onFiltersChange({ ...filters, showOutOfStock: event.target.checked })
            }
            className="h-4 w-4 accent-[#6b4f3a]"
          />
        </label>
      )}

      {categories.length > 0 && (
        <section className="border-b border-[#e3d8cc]">
          {sectionButton('Category', 'category')}
          {expanded.category && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-3 pb-5">
              {categories.map((category) => (
                <label key={category} className="flex min-w-0 items-center gap-2 text-sm text-[#2b211b]">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 shrink-0 accent-[#6b4f3a]"
                  />
                  <span className="truncate">
                    {categoryNames[category] ?? category.replace(/-/g, ' ')}
                    <span className="ml-1 text-xs text-[#6f6258]">
                      ({products.filter((product) => product.category === category).length})
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="border-b border-[#e3d8cc]">
        {sectionButton('Price', 'price')}
        {expanded.price && (
          <div className="grid grid-cols-2 gap-3 pb-5">
            <label className="border border-[#e3d8cc] bg-white px-3 py-2">
              <span className="sr-only">Minimum price</span>
              <span className="mr-1 text-[#6f6258]">₹</span>
              <input
                type="number"
                min="0"
                max={priceCeiling || undefined}
                value={filters.minPrice}
                onChange={(event) =>
                  onFiltersChange({ ...filters, minPrice: event.target.value })
                }
                placeholder="0"
                className="w-[calc(100%-1rem)] bg-transparent text-sm text-[#2b211b] outline-none"
              />
            </label>
            <label className="border border-[#e3d8cc] bg-white px-3 py-2">
              <span className="sr-only">Maximum price</span>
              <span className="mr-1 text-[#6f6258]">₹</span>
              <input
                type="number"
                min="0"
                max={priceCeiling || undefined}
                value={filters.maxPrice}
                onChange={(event) =>
                  onFiltersChange({ ...filters, maxPrice: event.target.value })
                }
                placeholder={priceCeiling ? String(priceCeiling) : 'Any'}
                className="w-[calc(100%-1rem)] bg-transparent text-sm text-[#2b211b] outline-none"
              />
            </label>
          </div>
        )}
      </section>

      {sizes.length > 0 && (
        <section className="border-b border-[#e3d8cc]">
          {sectionButton('Size', 'size')}
          {expanded.size && (
            <div className="flex flex-wrap gap-2 pb-5">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={filters.size === size}
                  onClick={() =>
                    onFiltersChange({ ...filters, size: filters.size === size ? '' : size })
                  }
                  className={`min-w-10 border px-3 py-2 text-xs transition-colors ${
                    filters.size === size
                      ? 'border-[#6b4f3a] bg-[#6b4f3a] text-white'
                      : 'border-[#e3d8cc] text-[#2b211b] hover:border-[#b98b67]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {colours.length > 0 && (
        <section className="border-b border-[#e3d8cc]">
          {sectionButton('Colour', 'colour')}
          {expanded.colour && (
            <div className="grid grid-cols-2 gap-3 pb-5">
              {colours.map((color) => (
                <label key={color} className="flex items-center gap-2 text-sm text-[#2b211b]">
                  <input
                    type="checkbox"
                    checked={filters.color === color}
                    onChange={() =>
                      onFiltersChange({ ...filters, color: filters.color === color ? '' : color })
                    }
                    className="h-4 w-4 accent-[#6b4f3a]"
                  />
                  {color}
                </label>
              ))}
            </div>
          )}
        </section>
      )}
    </aside>
  )
}

export default ProductFilters
