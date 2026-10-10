import CollectionPage from '../components/products/CollectionPage'
import { useProducts } from '../context/ProductsContext'

function Shop() {
  const { products } = useProducts()
  return <CollectionPage title="Shop All" products={products} />
}

export default Shop
