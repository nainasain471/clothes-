import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProducts = () => {
    apiRequest('/products')
      .then(({ products: result }) => setProducts(result))
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false))
  }

  const reload = () => {
    setLoading(true)
    setError('')
    fetchProducts()
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <ProductsContext.Provider value={{ products, loading, error, reload }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used inside a ProductsProvider')
  }
  return context
}
