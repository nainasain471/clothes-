import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useWishlist } from '../../context/WishlistContext'
import ProductImage from './ProductImage'

function ProductCard({ product, showNewBadge = false, showSaleBadge = false }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const wishlistActive = isInWishlist(product.id)
  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  const handleWishlist = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      if (wishlistActive) {
        await removeFromWishlist(product.id)
      } else {
        await addToWishlist(product)
        Swal.fire({
          title: 'Added to wishlist!',
          text: `${product.name} has been saved to your wishlist.`,
          icon: 'success',
          confirmButtonColor: '#6b4f3a',
        })
      }
    } catch (error) {
      Swal.fire({
        title: 'Unable to update wishlist',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#6b4f3a',
      })
    }
  }

  return (
    <div className="group bg-white pb-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">

        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="h-full w-full transition duration-500 group-hover:scale-105"
          />
        </Link>

        {showNewBadge && (
          <span className="absolute bottom-3 left-3 bg-white px-3 py-2 text-[9px] font-medium uppercase tracking-[0.12em] text-[#2b211b]">
            Just in
          </span>
        )}
        {showSaleBadge && discountPercentage > 0 && (
          <span className="absolute bottom-3 left-3 bg-[#6b4f3a] px-3 py-2 text-[9px] font-medium uppercase tracking-[0.1em] text-white">
            Save {discountPercentage}%
          </span>
        )}

        <button
          type="button"
          aria-label={wishlistActive ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={handleWishlist}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg shadow-sm transition hover:scale-105 ${
            wishlistActive ? 'text-[#b98b67]' : 'text-[#2b211b]'
          }`}
        >
          {wishlistActive ? '♥' : '♡'}
        </button>
      </div>

      <Link to={`/product/${product.id}`} className="block">
        <div className="px-3 pt-3">
          <h3 className="font-sans text-sm font-medium text-[#2b211b]">{product.name}</h3>

          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm text-[#2b211b]">
              ₹{product.price}
            </p>

            {product.oldPrice && (
              <p className="text-xs text-[#6f6258] line-through">
                ₹{product.oldPrice}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard