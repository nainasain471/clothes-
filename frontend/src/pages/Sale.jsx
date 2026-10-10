import { useParams } from 'react-router-dom'
import CollectionPage from '../components/products/CollectionPage'
import { useProducts } from '../context/ProductsContext'

const saleShortcuts = [
  { label: "MEN'S TEES", to: '/sale/category/t-shirts' },
  { label: "MEN'S SWEATSHIRTS", to: '/sale/category/hoodies' },
  { label: "MEN'S PANTS", to: '/sale/category/pants' },
  { label: "MEN'S SHIRTS", to: '/sale/category/shirts' },
]

const saleCategories = {
  't-shirts': ['t-shirts'],
  shirts: ['shirts'],
  polos: ['polos'],
  hoodies: ['hoodies'],
  jackets: ['jackets'],
  pants: ['jeans', 'trousers'],
  shorts: ['shorts'],
}

const saleCategoryTitles = {
  't-shirts': 'Tees',
  shirts: 'Shirts',
  polos: 'Polos',
  hoodies: 'Sweatshirts',
  jackets: 'Jackets',
  pants: 'Pants',
  shorts: 'Shorts',
}

function Sale() {
  const { category } = useParams()
  const { products } = useProducts()
  const discountedProducts = products.filter(
    (product) =>
      product.gender === 'men' &&
      product.oldPrice &&
      product.oldPrice > product.price
  )
  const categoryProducts = category
    ? discountedProducts.filter((product) =>
        (saleCategories[category] ?? [category]).includes(product.category)
      )
    : discountedProducts
  const title = category
    ? `Men's Sale ${saleCategoryTitles[category] ?? category.replace(/-/g, ' ')}`
    : "Men's Sale"

  return (
    <CollectionPage
      title={title}
      gender="men"
      products={categoryProducts}
      shortcuts={saleShortcuts}
      showSaleBadge
    />
  )
}

export default Sale
