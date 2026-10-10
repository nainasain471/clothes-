import CollectionPage from '../components/products/CollectionPage'
import { useProducts } from '../context/ProductsContext'

function Men() {
  const { products } = useProducts()
  const menProducts = products.filter((product) => product.gender === 'men')

  return <CollectionPage title="Men" gender="men" products={menProducts} />
}

export default Men
