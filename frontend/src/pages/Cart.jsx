import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ProductImage from '../components/products/ProductImage'


function Cart() {
  const {
    cartItems,
    cartTotal,
    cartError,
    reloadCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f6f0e8] px-4 py-14 text-center sm:px-6 sm:py-20">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">
          ZELIA
        </p>

        <h1 className="text-3xl font-medium min-[380px]:text-4xl md:text-5xl">
          Your Bag is Empty
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-gray-500">
          You haven't added anything to your shopping bag yet.
        </p>
        {cartError && (
          <p role="alert" className="mx-auto mt-4 max-w-lg text-sm text-red-700">
            Cart changes could not be saved: {cartError}{' '}
            <button type="button" onClick={reloadCart} className="underline underline-offset-2">
              Retry
            </button>
          </p>
        )}

        <Link
          to="/shop"
          className="mt-8 inline-block bg-[#6b4f3a] px-8 py-4 text-sm text-white transition-colors hover:bg-[#b98b67]"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f0e8]">

      {/* Page Header */}
      <div className="px-4 py-12 text-center sm:px-6 sm:py-16 md:px-10 lg:px-16">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">
          ZELIA
        </p>

        <h1 className="text-3xl font-medium min-[380px]:text-4xl md:text-6xl">
          Shopping Bag
        </h1>
        {cartError && (
          <p role="alert" className="mx-auto mt-5 max-w-lg text-sm text-red-700">
            Cart changes could not be saved: {cartError}{' '}
            <button type="button" onClick={reloadCart} className="underline underline-offset-2">
              Retry
            </button>
          </p>
        )}
      </div>

      {/* Cart Content */}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 sm:gap-12 sm:px-6 sm:pb-20 md:px-10 lg:grid-cols-3 lg:px-16">

        {/* Products */}
        <div className="space-y-8 lg:col-span-2">

          {cartItems.map((item) => (
            <div
                           key={`${item.id}-${item.selectedSize}`}
              className="flex gap-3 border-b border-gray-200 pb-8 sm:gap-5"
            >

              {/* Product Image */}
                            <Link
                to={`/product/${item.id}`}
                className="h-36 w-28 shrink-0 sm:h-48 sm:w-36"
              >
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full"
                />
              </Link>

              {/* Product Details */}
              <div className="flex flex-1 flex-col justify-between">

                <div>
                  <h2 className="text-sm">
                    {item.name}
                  </h2>

                  <p className="mt-2 text-xs text-gray-500">
                    Size: {item.selectedSize || 'M'}
                  </p>

                  <p className="mt-2 text-lg font-medium">
                    ₹{item.price}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">

                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300">

                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id, item.selectedSize)}
                      className="px-3 py-2 text-sm"
                    >
                      −
                    </button>

                    <span className="px-3 text-sm">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id, item.selectedSize)}
                      disabled={item.quantity >= 10}
                      className="px-3 py-2 text-sm"
                    >
                      +
                    </button>

                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="text-xs underline underline-offset-4"
                  >
                    REMOVE
                  </button>

                </div>
              </div>

            </div>
          ))}

        </div>

        {/* Order Summary */}
        <div className="h-fit border border-gray-200 p-6">

          <h2 className="text-lg font-medium">
            Order Summary
          </h2>
          {cartError && (
            <p role="alert" className="mt-4 text-sm text-red-700">
              Cart changes could not be saved: {cartError}{' '}
              <button type="button" onClick={reloadCart} className="underline underline-offset-2">
                Retry
              </button>
            </p>
          )}

          <div className="mt-6 space-y-4 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Subtotal
              </span>

              <span>
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Shipping
              </span>

              <span>
                FREE
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between font-medium">
                <span>
                  Total
                </span>

                <span>
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

          </div>

          <Link
            to="/checkout"
            className="mt-7 block w-full bg-[#6b4f3a] py-4 text-center text-sm text-white transition-colors hover:bg-[#b98b67]"
          >
            PROCEED TO CHECKOUT
          </Link>

        </div>

      </div>
    </div>
  )
}

export default Cart