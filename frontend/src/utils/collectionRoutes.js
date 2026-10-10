import products from '../data/products'

const womenCategorySlugs = new Set(['dresses', 'tops', 'kurtas', 'trousers', 'co-ords', 'skirts', 'bottoms'])
const menCategorySlugs = new Set([
  't-shirts',
  'shirts',
  'polos',
  'sweaters',
  'hoodies',
  'jackets',
  'pants',
  'shorts',
  'jeans',
])

export function getCollectionGender(pathname) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'

  if (normalizedPath === '/women' || normalizedPath.startsWith('/women/')) return 'women'
  if (normalizedPath === '/men' || normalizedPath.startsWith('/men/')) return 'men'
  if (normalizedPath === '/sale' || normalizedPath.startsWith('/sale/')) return 'men'
  if (normalizedPath === '/new-arrivals/women') return 'women'
  if (normalizedPath === '/new-arrivals/men' || normalizedPath === '/new-arrivals/denim') return 'men'

  const categoryMatch = normalizedPath.match(/^\/category\/([^/]+)$/)
  if (categoryMatch) {
    if (womenCategorySlugs.has(categoryMatch[1])) return 'women'
    if (menCategorySlugs.has(categoryMatch[1])) return 'men'
  }

  const productMatch = normalizedPath.match(/^\/product\/([^/]+)$/)
  if (productMatch) {
    return products.find((product) => String(product.id) === productMatch[1])?.gender
  }

  return null
}
