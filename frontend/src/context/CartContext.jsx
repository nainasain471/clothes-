import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { apiRequest } from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)
const GUEST_CART_KEY = 'zelia-guest-cart'

function readStoredCart(storageKey) {
  const storedCart = localStorage.getItem(storageKey)
  if (!storedCart) return null
  try {
    const items = JSON.parse(storedCart)
    return Array.isArray(items)
      ? items.filter(
          (item) =>
            item &&
            Number.isInteger(item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            Number.isFinite(item.price),
        )
      : []
  } catch (error) {
    console.error('Unable to read a saved cart:', error)
    localStorage.removeItem(storageKey)
    return null
  }
}

function readGuestCart() {
  return readStoredCart(GUEST_CART_KEY) || []
}

function getAccountCartKey(userId) {
  return `${GUEST_CART_KEY}-${userId}`
}

function mergeCarts(accountItems, guestItems) {
  const itemsByProductAndSize = new Map()
  for (const item of [...accountItems, ...guestItems]) {
    const size = item.selectedSize || item.sizes?.[0] || 'M'
    const key = `${item.id}-${size}`
    const existingItem = itemsByProductAndSize.get(key)
    itemsByProductAndSize.set(key, {
      ...item,
      selectedSize: size,
      quantity: Math.min(10, (existingItem?.quantity || 0) + item.quantity),
    })
  }
  return [...itemsByProductAndSize.values()]
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [cartItems, setCartItems] = useState(readGuestCart)
  const [loadedUserId, setLoadedUserId] = useState(null)
  const [cartError, setCartError] = useState('')
  const [reloadVersion, setReloadVersion] = useState(0)
  const cartItemsRef = useRef(cartItems)
  const saveQueueRef = useRef(Promise.resolve())
  const previousUserIdRef = useRef(user?.id ?? null)
  const skipGuestPersistRef = useRef(false)
  cartItemsRef.current = cartItems

  useEffect(() => {
    if (authLoading) return undefined
    if (!user) {
      if (previousUserIdRef.current !== null) {
        skipGuestPersistRef.current = true
        setCartItems(readGuestCart())
      }
      previousUserIdRef.current = null
      setLoadedUserId(null)
      return undefined
    }

    previousUserIdRef.current = user.id
    let active = true
    setLoadedUserId(null)
    apiRequest('/cart')
      .then(({ items }) => {
        if (!active) return
        const accountBackup = readStoredCart(getAccountCartKey(user.id))
        const mergedItems = mergeCarts(accountBackup || items, cartItemsRef.current)
        setCartItems(mergedItems)
        setLoadedUserId(user.id)
        setCartError('')
        localStorage.setItem(getAccountCartKey(user.id), JSON.stringify(mergedItems))
        localStorage.removeItem(GUEST_CART_KEY)
      })
      .catch((error) => {
        if (active) setCartError(error.message)
      })

    return () => {
      active = false
    }
  }, [user?.id, authLoading, reloadVersion])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      if (skipGuestPersistRef.current) {
        skipGuestPersistRef.current = false
        return
      }
      if (cartItems.length) {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems))
      } else {
        localStorage.removeItem(GUEST_CART_KEY)
      }
      return
    }
    if (loadedUserId !== user.id) return

    let active = true
    const accountCartKey = getAccountCartKey(user.id)
    localStorage.setItem(accountCartKey, JSON.stringify(cartItems))
    const timeoutId = window.setTimeout(() => {
      saveQueueRef.current = saveQueueRef.current
        .then(() =>
          active
            ? apiRequest('/cart', {
                method: 'PUT',
                body: JSON.stringify({
                  items: cartItems.map((item) => ({
                    productId: item.id,
                    size: item.selectedSize || item.sizes?.[0] || 'M',
                    quantity: item.quantity,
                  })),
                }),
              })
            : undefined,
        )
        .then(() => {
          if (!active) return
          setCartError('')
          localStorage.removeItem(accountCartKey)
          localStorage.removeItem(GUEST_CART_KEY)
        })
        .catch((error) => {
          if (active) setCartError(error.message)
        })
    }, 250)

    return () => {
      active = false
      window.clearTimeout(timeoutId)
    }
  }, [cartItems, loadedUserId, user?.id, authLoading])

  const addToCart = (product) => {
    const selectedSize = product.selectedSize || product.sizes?.[0] || 'M'
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id && item.selectedSize === selectedSize,
      )

      if (existingItem) {
        if (existingItem.quantity >= 10) return currentItems
        return currentItems.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentItems, { ...product, selectedSize, quantity: 1 }]
    })
  }

  const removeFromCart = (productId, selectedSize) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => !(item.id === productId && item.selectedSize === selectedSize),
      ),
    )
  }

  const increaseQuantity = (productId, selectedSize) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity: Math.min(10, item.quantity + 1) }
          : item,
      ),
    )
  }

  const decreaseQuantity = (productId, selectedSize) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )
  const clearCart = () => setCartItems([])
  const reloadCart = () => {
    setCartError('')
    setReloadVersion((version) => version + 1)
  }

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartTotal,
      cartError,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      reloadCart,
    }),
    [cartItems, cartCount, cartTotal, cartError],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider')
  }
  return context
}
