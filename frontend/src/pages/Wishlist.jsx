import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import ProductImage from '../components/products/ProductImage'

function Wishlist() {
  const {
    wishlistItems,
    wishlistError,
    removeFromWishlist,
  } = useWishlist()

  const { addToCart } = useCart()

  const handleAddToCart = async (product) => {
    addToCart(product)
    try {
      await removeFromWishlist(product.id)
      Swal.fire({
        title: 'Added to cart!',
        text: `${product.name} has been added to your cart.`,
        icon: 'success',
        confirmButtonColor: '#6b4f3a',
      })
    } catch (error) {
      Swal.fire({
        title: 'Unable to update wishlist',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#6b4f3a',
      })
    }
  }

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId)
    } catch (error) {
      Swal.fire({
        title: 'Unable to update wishlist',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#6b4f3a',
      })
    }
  }

  if (wishlistItems.length === 0 && !wishlistError) {
    return (
      <div className="min-h-screen bg-[#f6f0e8] px-4 py-14 text-center sm:px-6 sm:py-20">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">
          ZELIA
        </p>

        <h1 className="text-3xl font-medium min-[380px]:text-4xl md:text-5xl">
          Your Wishlist is Empty
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-gray-500">
          Save your favorite pieces and they will appear here.
        </p>

        <Link
          to="/shop"
          className="mt-8 inline-block bg-[#6b4f3a] px-8 py-4 text-sm text-white transition-colors hover:bg-[#b98b67]"
        >
          EXPLORE PRODUCTS
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f0e8]">

      {/* Page Header */}
      <div className="px-4 py-12 text-center sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-16">
        {wishlistError && <p role="alert" className="mb-4 text-sm text-red-700">{wishlistError}</p>}
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">
          ZELIA
        </p>

        <h1 className="text-3xl font-medium min-[380px]:text-4xl md:text-6xl">
          Wishlist
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-gray-600">
          Your saved favorites.
        </p>
      </div>

      {/* Wishlist Products */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 px-3 pb-12 min-[380px]:gap-x-4 min-[380px]:px-4 sm:gap-y-10 sm:px-6 sm:pb-20 md:grid-cols-4 md:px-10 lg:px-16">

        {wishlistItems.map((product) => (
          <div key={product.id} className="group min-w-0 bg-white p-2 min-[380px]:p-3">

            {/* Product Image */}
            <Link to={`/product/${product.id}`}>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                               <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full transition duration-500 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Product Information */}
            <div className="mt-4">

              <h2 className="text-sm">
                {product.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                ₹{product.price}
              </p>

              {/* Buttons */}
              <div className="mt-4 flex gap-1.5 min-[380px]:gap-2">

                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="min-w-0 flex-1 bg-[#6b4f3a] px-1 py-2 text-[10px] text-white transition-colors hover:bg-[#b98b67] min-[380px]:text-xs"
                >
                  ADD TO CART
                </button>

                <button
                  type="button"
                  onClick={() => handleRemove(product.id)}
                  className="shrink-0 border border-[#6b4f3a] px-2 py-2 text-xs text-[#6b4f3a] transition-colors hover:border-[#b98b67] hover:bg-[#b98b67] hover:text-white min-[380px]:px-3"
                  aria-label="Remove from wishlist"
                >
                  ×
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default Wishlist