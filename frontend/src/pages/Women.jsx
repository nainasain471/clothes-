import CollectionPage from '../components/products/CollectionPage'
import { useProducts } from '../context/ProductsContext'

function Women() {
  const { products } = useProducts()
  const womenProducts = products.filter((product) => product.gender === 'women')

  return <CollectionPage title="Women" gender="women" products={womenProducts} />
}

export default Women
