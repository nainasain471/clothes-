import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import ProductImage from '../components/products/ProductImage'
import { useProducts } from '../context/ProductsContext'

function ProductDetails() {
  const { id } = useParams()
  const { products, loading } = useProducts()

  const { addToCart } = useCart()

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist()

  const [selectedSize, setSelectedSize] = useState('')

  const product = products.find(
    (item) => item.id === Number(id)
  )

  if (loading) {
    return <p className="py-20 text-center text-sm text-gray-500">Loading product...</p>
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">

          <h1 className="text-3xl font-medium">
            Product Not Found
          </h1>

          <Link
            to="/shop"
            className="mt-6 inline-block border border-[#6b4f3a] px-8 py-3 text-sm text-[#6b4f3a] transition-colors hover:border-[#b98b67] hover:bg-[#b98b67] hover:text-white"
          >
            BACK TO SHOP
          </Link>

        </div>
      </div>
    )
  }

  const wishlistActive = isInWishlist(product.id)

  const handleWishlist = async () => {
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

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }

    addToCart({
      ...product,
      selectedSize,
    })
    Swal.fire({
      title: 'Added to cart!',
      text: `${product.name} has been added to your cart.`,
      icon: 'success',
      confirmButtonColor: '#6b4f3a',
    })
  }

  return (
    <div className="min-h-screen bg-[#f6f0e8] px-4 py-8 sm:px-6 sm:py-12 md:px-10 lg:px-16">

      <div className="mx-auto grid max-w-7xl gap-7 sm:gap-10 md:grid-cols-2">

        {/* Product Image */}
                <ProductImage
          src={product.image}
          alt={product.name}
          className="aspect-[3/4] w-full"
        />
        {/* Product Information */}
        <div className="flex flex-col justify-center">

          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            ZELIA Collection
          </p>

          <h1 className="mt-4 text-3xl font-medium md:text-4xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">

            <span className="text-lg">
              ₹{product.price}
            </span>

            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.oldPrice}
              </span>
            )}

          </div>

          {/* Description */}
          <p className="mt-6 max-w-lg text-sm leading-6 text-gray-600">
            A contemporary essential designed for everyday comfort
            and effortless style.
          </p>

          {/* Size */}
          <div className="mt-8">

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">
                Select Size
              </h2>

              {selectedSize && (
                <span className="text-xs text-gray-500">
                  Selected: {selectedSize}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">

              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`h-11 w-11 border text-sm transition ${
                    selectedSize === size
                      ? 'border-[#6b4f3a] bg-[#6b4f3a] text-white'
                      : 'border-[#e3d8cc] hover:border-[#b98b67] hover:bg-[#b98b67] hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}

            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-3">

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-[#6b4f3a] py-4 text-sm text-white transition-colors hover:bg-[#b98b67]"
            >
              ADD TO CART
            </button>

            <button
              type="button"
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              className={`flex h-14 w-14 items-center justify-center border text-xl transition ${
                wishlistActive
                  ? 'border-[#6b4f3a] bg-[#6b4f3a] text-white'
                  : 'border-[#e3d8cc] hover:border-[#b98b67] hover:bg-[#b98b67] hover:text-white'
              }`}
            >
              {wishlistActive ? '♥' : '♡'}
            </button>

          </div>

          <p className="mt-5 text-xs text-gray-400">
            Product ID: {product.id}
          </p>

        </div>
      </div>
    </div>
  )
}

export default ProductDetails