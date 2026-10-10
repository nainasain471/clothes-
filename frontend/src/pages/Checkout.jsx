import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { apiRequest } from '../services/api'
import ProductImage from '../components/products/ProductImage'

function Checkout() {
  const { user, loading } = useAuth()
  const { cartItems, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [saveAddress, setSaveAddress] = useState(false)
  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  useEffect(() => {
    const userId = user?.id
    if (loading || !userId) return undefined
    let active = true
    apiRequest('/addresses')
      .then(({ addresses: savedAddresses }) => {
        if (active) setAddresses(savedAddresses)
      })
      .catch((requestError) => {
        if (active) setError(`Unable to load saved addresses: ${requestError.message}`)
      })
    return () => {
      active = false
    }
  }, [user?.id, loading])

  const handleShippingChange = (event) => {
    const { name, value } = event.target
    setShipping((current) => ({ ...current, [name]: value }))
  }

  const handleAddressSelect = (event) => {
    const addressId = event.target.value
    setSelectedAddressId(addressId)
    const address = addresses.find((item) => String(item.id) === addressId)
    if (address) {
      setShipping({
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      })
    } else {
      setShipping({
        firstName: '',
        lastName: '',
        email: user.email,
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
      })
    }
  }

  const handleAddressDelete = async () => {
    const addressId = Number(selectedAddressId)
    try {
      await apiRequest(`/addresses/${addressId}`, { method: 'DELETE' })
      setAddresses((current) => current.filter((item) => item.id !== addressId))
      handleAddressSelect({ target: { value: '' } })
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const orderShipping = { ...shipping, email: shipping.email || user.email }
      const result = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({
          shipping: orderShipping,
          saveAddress,
          items: cartItems.map((item) => ({
            productId: item.id,
            size: item.selectedSize || 'M',
            quantity: item.quantity,
          })),
        }),
      })
      setOrderNumber(result.order.id)
      clearCart()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="py-20 text-center text-sm text-gray-500">Loading checkout...</p>
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] bg-[#f6f0e8] px-4 py-20 text-center">
        <h1 className="text-3xl font-medium">Sign in to place your order</h1>
        <p className="mt-4 text-sm text-gray-500">Your cart will be here after you sign in.</p>
        <Link to="/login" state={{ from: '/checkout' }} className="mt-8 inline-block bg-[#6b4f3a] px-8 py-4 text-sm text-white">SIGN IN</Link>
      </div>
    )
  }

  if (orderNumber) {
    return (
      <div className="min-h-[60vh] bg-[#f6f0e8] px-4 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Order confirmed</p>
        <h1 className="mt-4 text-3xl font-medium">Thank you for your order!</h1>
        <p className="mt-4 text-sm text-gray-500">Your order number is #{orderNumber}.</p>
        <button type="button" onClick={() => navigate('/account')} className="mt-8 bg-[#6b4f3a] px-8 py-4 text-sm text-white">VIEW MY ORDERS</button>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#f6f0e8] px-4 py-20 text-center">
        <h1 className="text-3xl font-medium">Your cart is empty</h1>
        <Link to="/shop" className="mt-8 inline-block bg-[#6b4f3a] px-8 py-4 text-sm text-white">CONTINUE SHOPPING</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f0e8] px-4 py-8 sm:px-6 sm:py-12 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-gray-200 pb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">ZELIA</p>
          <h1 className="text-3xl font-medium min-[380px]:text-4xl md:text-5xl">Checkout</h1>
        </div>

        <div className="grid gap-8 py-8 sm:gap-12 sm:py-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-medium">Shipping Information</h2>
              {addresses.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm" htmlFor="saved-address">
                    Use a saved address
                  </label>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <select
                      id="saved-address"
                      value={selectedAddressId}
                      onChange={handleAddressSelect}
                      className="h-12 min-w-0 flex-1 border border-[#e3d8cc] bg-white px-4 outline-none focus:border-[#6b4f3a]"
                    >
                      <option value="">Enter a new address</option>
                      {addresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.firstName} {address.lastName} — {address.address}, {address.city}
                        </option>
                      ))}
                    </select>
                    {selectedAddressId && (
                      <button
                        type="button"
                        onClick={handleAddressDelete}
                        className="border border-[#6b4f3a] px-4 text-xs text-[#6b4f3a]"
                      >
                        REMOVE SAVED ADDRESS
                      </button>
                    )}
                  </div>
                </div>
              )}
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm">First Name
                  <input name="firstName" value={shipping.firstName} onChange={handleShippingChange} autoComplete="given-name" required className="mt-2 h-12 w-full border border-[#e3d8cc] px-4 outline-none focus:border-[#6b4f3a]" />
                </label>
                <label className="text-sm">Last Name
                  <input name="lastName" value={shipping.lastName} onChange={handleShippingChange} autoComplete="family-name" required className="mt-2 h-12 w-full border border-[#e3d8cc] px-4 outline-none focus:border-[#6b4f3a]" />
                </label>
              </div>
              <label className="block text-sm">Email Address
                <input name="email" type="email" value={shipping.email} onChange={handleShippingChange} autoComplete="email" required className="mt-2 h-12 w-full border border-[#e3d8cc] px-4 outline-none focus:border-[#6b4f3a]" />
              </label>
              <label className="block text-sm">Phone Number
                <input name="phone" type="tel" value={shipping.phone} onChange={handleShippingChange} autoComplete="tel" required className="mt-2 h-12 w-full border border-[#e3d8cc] px-4 outline-none focus:border-[#6b4f3a]" />
              </label>
              <label className="block text-sm">Address
                <input name="address" value={shipping.address} onChange={handleShippingChange} autoComplete="street-address" required className="mt-2 h-12 w-full border border-[#e3d8cc] px-4 outline-none focus:border-[#6b4f3a]" />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm">City
                  <input name="city" value={shipping.city} onChange={handleShippingChange} autoComplete="address-level2" required className="mt-2 h-12 w-full border border-[#e3d8cc] px-4 outline-none focus:border-[#6b4f3a]" />
                </label>
                <label className="text-sm">State
                  <input name="state" value={shipping.state} onChange={handleShippingChange} autoComplete="address-level1" required className="mt-2 h-12 w-full border border-[#e3d8cc] px-4 outline-none focus:border-[#6b4f3a]" />
                </label>
              </div>
              <label className="block text-sm">PIN Code
                <input name="pincode" value={shipping.pincode} onChange={handleShippingChange} inputMode="numeric" pattern="[0-9]{6}" maxLength="6" autoComplete="postal-code" required className="mt-2 h-12 w-full border border-[#e3d8cc] px-4 outline-none focus:border-[#6b4f3a]" />
              </label>

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(event) => setSaveAddress(event.target.checked)}
                  className="h-4 w-4 accent-[#6b4f3a]"
                />
                Save this address to my account
              </label>

              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-medium">Payment Method</h2>
                <p className="mt-4 border border-gray-300 p-4 text-sm">Cash on Delivery</p>
              </div>
              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
              <button type="submit" disabled={submitting} className="h-14 w-full bg-[#6b4f3a] text-sm text-white transition-colors hover:bg-[#b98b67] disabled:opacity-60">
                {submitting ? 'PLACING ORDER...' : 'PLACE ORDER'}
              </button>
            </form>
          </div>

          <aside className="h-fit border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-medium">Order Summary</h2>
            <div className="mt-6 space-y-5">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                  <ProductImage src={item.image} alt={item.name} className="h-24 w-20 shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm">{item.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">Size: {item.selectedSize} × {item.quantity}</p>
                    <p className="mt-2 text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
                <div className="mt-4 flex justify-between"><span className="text-gray-500">Shipping</span><span>FREE</span></div>
                <div className="mt-5 border-t border-gray-200 pt-5">
                  <div className="flex justify-between font-medium"><span>Total</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Checkout
