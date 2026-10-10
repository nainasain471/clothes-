import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import Footer from './components/Footer'
import Navbar from './components/Navbar'
import AnnouncementBar from './components/sections/announcementbar'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Men from './pages/Men'
import Women from './pages/Women'
import NewArrivals from './pages/NewArrivals'
import Category from './pages/Category'
import ProductDetails from './pages/ProductDetails'
import Search from './pages/Search'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import Checkout from './pages/Checkout'
import Sale from './pages/Sale'
import InformationPage from './pages/InformationPage'
import AdminRoutes from './admin/routes/AdminRoutes.jsx'
import { useProducts } from './context/ProductsContext'

function AppRoutes() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const { error: productsError, reload: reloadProducts } = useProducts()

  return (
    <>
      {!isAdminRoute && <AnnouncementBar />}
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && productsError && (
        <div role="alert" className="flex flex-wrap items-center justify-center gap-3 bg-red-50 px-4 py-3 text-sm text-red-800">
          <span>Could not load products: {productsError}</span>
          <button type="button" onClick={reloadProducts} className="underline underline-offset-2">Retry</button>
        </div>
      )}
      <Routes>

        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/sale/category/:category" element={<Sale />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/new-arrivals/:collection" element={<NewArrivals />} />

        {/* Category & Product */}
        <Route path="/category/:category" element={<Category />} />
        <Route path="/:gender/category/:category" element={<Category />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Search */}
        <Route path="/search" element={<Search />} />

        {/* User Pages */}
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/contact" element={<InformationPage />} />
        <Route path="/shipping" element={<InformationPage />} />
        <Route path="/returns" element={<InformationPage />} />
        <Route path="/faqs" element={<InformationPage />} />
        <Route path="/privacy" element={<InformationPage />} />
        <Route path="/social/:platform" element={<InformationPage />} />

        {/* Checkout */}
        <Route path="/checkout" element={<Checkout />} />

      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App