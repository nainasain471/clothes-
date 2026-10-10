import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../services/api'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [guestWishlist, setGuestWishlist] = useState([])
  const [accountWishlist, setAccountWishlist] = useState([])
  const [loadedUserId, setLoadedUserId] = useState(null)
  const [wishlistError, setWishlistError] = useState('')
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) return undefined
    if (!user) return undefined

    let active = true
    apiRequest('/wishlist')
      .then(({ wishlist }) => {
        if (active) {
          setAccountWishlist(wishlist)
          setLoadedUserId(user.id)
          setWishlistError('')
        }
      })
      .catch((error) => {
        if (active) setWishlistError(error.message)
      })

    return () => {
      active = false
    }
  }, [user, authLoading])

  const wishlistItems = user
    ? loadedUserId === user.id ? accountWishlist : []
    : guestWishlist

  const addToWishlist = async (product) => {
    if (user) {
      await apiRequest(`/wishlist/${product.id}`, { method: 'POST' })
      setWishlistError('')
      setAccountWishlist((currentItems) =>
        currentItems.some((item) => item.id === product.id)
          ? currentItems
          : [...currentItems, product],
      )
    } else {
      setGuestWishlist((currentItems) =>
        currentItems.some((item) => item.id === product.id)
          ? currentItems
          : [...currentItems, product],
      )
    }
  }

  const removeFromWishlist = async (productId) => {
    if (user) {
      await apiRequest(`/wishlist/${productId}`, { method: 'DELETE' })
      setWishlistError('')
      setAccountWishlist((currentItems) =>
        currentItems.filter((item) => item.id !== productId)
      )
    } else {
      setGuestWishlist((currentItems) =>
        currentItems.filter((item) => item.id !== productId)
      )
    }
  }

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item.id === productId)

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistError: user ? wishlistError : '',
        wishlistCount: wishlistItems.length,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used inside a WishlistProvider')
  }
  return context
}
