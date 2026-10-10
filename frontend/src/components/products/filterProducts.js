function filterProducts(products, filters) {
  return products.filter((product) => {
    const matchesCategory =
      filters.categories.length === 0 || filters.categories.includes(product.category)
    const matchesMinPrice =
      filters.minPrice === '' || product.price >= Number(filters.minPrice)
    const matchesMaxPrice =
      filters.maxPrice === '' || product.price <= Number(filters.maxPrice)
    const matchesSize = !filters.size || (product.sizes ?? []).includes(filters.size)
    const matchesColor = !filters.color || product.color === filters.color
    const matchesAvailability = filters.showOutOfStock || product.inStock !== false

    return (
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesSize &&
      matchesColor &&
      matchesAvailability
    )
  })
}

export default filterProducts
