import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Account() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [ordersError, setOrdersError] = useState('')
  const [addresses, setAddresses] = useState([])
  const [addressesError, setAddressesError] = useState('')

  useEffect(() => {
    if (loading || !user) return
    apiRequest('/orders')
      .then(({ orders: userOrders }) => setOrders(userOrders))
      .catch((error) => setOrdersError(error.message))
  }, [user, loading])

  useEffect(() => {
    const userId = user?.id
    if (loading || !userId) return undefined
    let active = true
    apiRequest('/addresses')
      .then(({ addresses: savedAddresses }) => {
        if (active) setAddresses(savedAddresses)
      })
      .catch((error) => {
        if (active) setAddressesError(error.message)
      })
    return () => {
      active = false
    }
  }, [user?.id, loading])

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const handleAddressDelete = async (addressId) => {
    try {
      await apiRequest(`/addresses/${addressId}`, { method: 'DELETE' })
      setAddresses((current) => current.filter((address) => address.id !== addressId))
      setAddressesError('')
    } catch (error) {
      setAddressesError(error.message)
    }
  }

  if (loading) {
    return <p className="py-20 text-center text-sm text-gray-500">Loading account...</p>
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] bg-[#f6f0e8] px-4 py-20 text-center">
        <h1 className="text-3xl font-medium">Sign in to your account</h1>
        <p className="mt-4 text-sm text-gray-500">View your orders and saved products.</p>
        <Link to="/login" className="mt-8 inline-block bg-[#6b4f3a] px-8 py-4 text-sm text-white">SIGN IN</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f0e8] px-4 py-10 sm:px-6 sm:py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-gray-200 pb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-500">ZELIA Account</p>
          <h1 className="text-3xl font-medium min-[380px]:text-4xl md:text-5xl">My Account</h1>
          <p className="mt-4 text-sm text-gray-500">Welcome, {user.name}.</p>
        </div>

        <div className="grid gap-6 py-10 md:grid-cols-2">
          <section className="border border-gray-200 p-6">
            <h2 className="text-lg font-medium">Account Information</h2>
            <p className="mt-4 text-xs uppercase tracking-wide text-gray-400">Name</p>
            <p className="mt-1 text-sm">{user.name}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-gray-400">Email</p>
            <p className="mt-1 text-sm">{user.email}</p>
          </section>
          <section className="border border-gray-200 p-6">
            <h2 className="text-lg font-medium">Wishlist</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">View products you have saved for later.</p>
            <Link to="/wishlist" className="mt-6 inline-block text-xs underline underline-offset-4">VIEW WISHLIST</Link>
          </section>
        </div>

        <section className="border-t border-gray-200 py-8">
          <h2 className="text-xl font-medium">Saved Shipping Addresses</h2>
          {addressesError && <p role="alert" className="mt-4 text-sm text-red-700">{addressesError}</p>}
          {!addressesError && addresses.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">Addresses you save at checkout will appear here.</p>
          )}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <article key={address.id} className="border border-gray-200 bg-white p-5">
                <p className="text-sm font-medium">{address.firstName} {address.lastName}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {address.address}, {address.city}, {address.state} {address.pincode}
                </p>
                <p className="mt-1 text-sm text-gray-500">{address.phone}</p>
                <button
                  type="button"
                  onClick={() => handleAddressDelete(address.id)}
                  className="mt-4 text-xs underline underline-offset-4"
                >
                  REMOVE ADDRESS
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-gray-200 py-8">
          <h2 className="text-xl font-medium">My Orders</h2>
          {ordersError && <p role="alert" className="mt-4 text-sm text-red-700">{ordersError}</p>}
          {!ordersError && orders.length === 0 && <p className="mt-4 text-sm text-gray-500">You haven't placed any orders yet.</p>}
          <div className="mt-5 space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="border border-gray-200 bg-white p-5">
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <p>Order #{order.id}</p>
                  <p className="capitalize">{order.status} · ₹{order.total.toLocaleString('en-IN')}</p>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-gray-500">
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.productId}-${item.size}`}>
                      {item.name} · Size {item.size} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-200 pt-8">
          <button type="button" onClick={handleSignOut}
            className="border border-[#6b4f3a] px-8 py-3 text-xs text-[#6b4f3a] transition-colors hover:border-[#b98b67] hover:bg-[#b98b67] hover:text-white">
            SIGN OUT
          </button>
        </div>
      </div>
    </div>
  )
}

export default Account
