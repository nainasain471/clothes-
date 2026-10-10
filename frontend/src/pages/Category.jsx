import { useParams } from 'react-router-dom'
import CollectionPage from '../components/products/CollectionPage'
import { useProducts } from '../context/ProductsContext'

const categoryTitles = {
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
  bottoms: 'Bottoms',
}

function Category() {
  const { category, gender } = useParams()
  const { products } = useProducts()
  const categoryProducts = products.filter((product) => {
    const matchesGender = !gender || product.gender === gender
    const matchesCategory =
      category === 'bottoms'
        ? ['trousers', 'skirts'].includes(product.category)
        : product.category === category

    return matchesGender && matchesCategory
  })

  const categoryTitle = categoryTitles[category] ?? 'Collection'
  const title = gender
    ? `${gender === 'men' ? "Men's" : "Women's"} ${categoryTitle}`
    : categoryTitle

  return <CollectionPage title={title} gender={gender} products={categoryProducts} />
}

export default Category
