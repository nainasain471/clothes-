import { useParams } from 'react-router-dom'
import CollectionPage from '../components/products/CollectionPage'
import { useProducts } from '../context/ProductsContext'

function NewArrivals() {
  const { collection } = useParams()
  const { products } = useProducts()
  const collections = {
    men: {
      title: "Men's New Arrivals",
      products: products.filter((product) => product.gender === 'men'),
    },
    women: {
      title: "Women's New Arrivals",
      products: products.filter((product) => product.gender === 'women'),
    },
    denim: {
      title: 'Denim',
      products: products.filter(
        (product) =>
          product.gender === 'men' &&
          (product.category === 'jeans' ||
            product.name.toLowerCase().includes('denim'))
      ),
    },
  }
  const activeCollection = collections[collection]
  const page = activeCollection ?? {
    title: 'New Arrivals',
    products: products.slice(0, 8),
  }

  return (
    <CollectionPage
      title={page.title}
      products={page.products}
      gender={collection === 'women' ? 'women' : collection ? 'men' : undefined}
      showNewBadge
    />
  )
}

export default NewArrivals
