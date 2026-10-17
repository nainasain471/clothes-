import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { getCollectionGender } from '../utils/collectionRoutes'
import ProductImage from './products/ProductImage'

// 👇 Dropdown menu ka saara data yahin hai. Yahan se links/naam badal sakte ho.
const menus = {
  men: {
    label: 'MEN',
    to: '/men',
    featured: [
      { name: 'New Arrivals', to: '/new-arrivals/men' },
      { name: 'Best Sellers', to: '/men' },
      { name: 'Shop All Men', to: '/men' },
    ],
    clothing: [
      { name: 'Tees', to: '/men/category/t-shirts' },
      { name: 'Shirts', to: '/men/category/shirts' },
      { name: 'Polos', to: '/men/category/polos' },
      { name: 'Sweaters', to: '/men/category/sweaters' },
      { name: 'Sweatshirts', to: '/men/category/hoodies' },
      { name: 'Jackets', to: '/men/category/jackets' },
      { name: 'Pants', to: '/men/category/pants' },
      { name: 'Shorts', to: '/men/category/shorts' },
      { name: 'Denim', to: '/men/category/jeans' },
    ],
    promos: [
      {
        name: 'Shirts',
        note: 'Shop now',
        image: '/images/products/2.jpg',
        to: '/men/category/shirts',
      },
      {
        name: 'Denim',
        note: 'Shop now',
        image: '/images/products/3.jpg',
        to: '/men/category/jeans',
      },
    ],
  },
  women: {
    label: 'WOMEN',
    to: '/women',
    featured: [
      { name: 'New Arrivals', to: '/new-arrivals/women' },
      { name: 'Best Sellers', to: '/women' },
      { name: 'Shop All Women', to: '/women' },
    ],
    clothing: [
      { name: 'Dresses', to: '/women/category/dresses' },
      { name: 'Tops', to: '/women/category/tops' },
      { name: 'Kurtas', to: '/women/category/kurtas' },
      { name: 'Trousers', to: '/women/category/trousers' },
      { name: 'Co-ords', to: '/women/category/co-ords' },
      { name: 'Skirts', to: '/women/category/skirts' },
    ],
    promos: [
      {
        name: 'Dresses',
        note: 'Shop now',
        image: '/images/products/5.jpg',
        to: '/women/category/dresses',
      },
      {
        name: 'Co-ords',
        note: 'Shop now',
        image: '/images/products/9.jpg',
        to: '/women/category/co-ords',
      },
    ],
  },
  sale: {
    label: 'SALE',
    to: '/sale',
    featuredTitle: "MEN'S",
    clothing: [],
    featured: [
      { name: 'Shop All', to: '/sale' },
      { name: 'Tees', to: '/sale/category/t-shirts' },
      { name: 'Shirts', to: '/sale/category/shirts' },
      { name: 'Polos', to: '/sale/category/polos' },
      { name: 'Sweatshirts', to: '/sale/category/hoodies' },
      { name: 'Jackets', to: '/sale/category/jackets' },
      { name: 'Pants', to: '/sale/category/pants' },
      { name: 'Shorts', to: '/sale/category/shorts' },
    ],
    promos: [
      {
        name: 'Shirts',
        note: 'Shop sale',
        image: '/images/products/2.jpg',
        to: '/sale/category/shirts',
      },
      {
        name: 'Pants',
        note: 'Shop sale',
        image: '/images/products/3.jpg',
        to: '/sale/category/pants',
      },
    ],
  },
}

const newArrivalsLinks = [
  { name: "Men's New Arrivals", to: '/new-arrivals/men' },
  { name: "Women's New Arrivals", to: '/new-arrivals/women' },
  { name: 'Denim', to: '/new-arrivals/denim' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false) // mobile menu
  const [activeMenu, setActiveMenu] = useState(null) // desktop dropdown: 'men' | 'women' | null
  const [openSection, setOpenSection] = useState(null) // mobile accordion
  const { pathname } = useLocation()
  const collectionGender = getCollectionGender(pathname)
  const searchPath = collectionGender
    ? `/search?gender=${collectionGender}`
    : '/search'
  const visibleMenus = Object.entries(menus).filter(
    ([key]) =>
      !collectionGender ||
      key === 'sale' && collectionGender === 'men' ||
      key === collectionGender
  )
  const visibleNewArrivalsLinks = collectionGender
    ? newArrivalsLinks.filter((item) =>
        collectionGender === 'women'
          ? item.to === '/new-arrivals/women'
          : item.to !== '/new-arrivals/women'
      )
    : newArrivalsLinks

  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()

  const closeAll = () => {
    setActiveMenu(null)
    setMenuOpen(false)
    setOpenSection(null)
  }

  const panel = activeMenu && activeMenu !== 'newArrivals'
    ? menus[activeMenu]
    : null

  const desktopLinkClass = (isActive) =>
    `border-b pb-1 transition-colors ${
      isActive
        ? 'border-[#b98b67] text-[#b98b67]'
        : 'border-transparent hover:border-[#b98b67] hover:text-[#b98b67]'
    }`

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#e3d8cc] bg-[#f6f0e8]"
      onMouseLeave={() => setActiveMenu(null)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setActiveMenu(null)
      }}
    >
      <nav className="mx-auto flex min-h-[76px] max-w-[1600px] items-center justify-between px-4 sm:px-8 lg:px-12">

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center text-xl text-[#2b211b] transition-colors hover:text-[#b98b67] lg:hidden"
        >
          {menuOpen ? '×' : '☰'}
        </button>

        {/* Logo */}
        <Link
          to="/"
          onClick={closeAll}
          className="text-2xl font-semibold tracking-[0.2em] text-[#2b211b] transition-colors hover:text-[#b98b67] sm:text-3xl lg:absolute lg:left-1/2 lg:-translate-x-1/2"
        >
          ZELIA
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 text-[11px] font-medium tracking-[0.16em] text-[#2b211b] lg:flex">
          <button
            type="button"
            onMouseEnter={() => setActiveMenu('newArrivals')}
            onClick={() => setActiveMenu('newArrivals')}
            aria-haspopup="true"
            aria-expanded={activeMenu === 'newArrivals'}
            className={desktopLinkClass(activeMenu === 'newArrivals')}
          >
            NEW IN
          </button>

          {visibleMenus.map(([key, menu]) => (
            <button
              key={key}
              type="button"
              onMouseEnter={() => setActiveMenu(key)}
              onFocus={() => setActiveMenu(key)}
              onClick={() => setActiveMenu(key)}
              aria-haspopup="true"
              aria-expanded={activeMenu === key}
              className={desktopLinkClass(activeMenu === key)}
            >
              {menu.label}
            </button>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3 sm:gap-5">

          <Link
            to={searchPath}
            aria-label="Search"
            onClick={closeAll}
            className="text-[#2b211b] transition-colors hover:text-[#b98b67]"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.5 4.5" />
            </svg>
          </Link>

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            onClick={closeAll}
            className="relative text-[#2b211b] transition-colors hover:text-[#b98b67]"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M20.8 8.8c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11a4.5 4.5 0 0 1 8.8-1.4 4.5 4.5 0 0 1 8.8 1.4Z" />
            </svg>

            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#6b4f3a] px-1 text-[9px] text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/account"
            aria-label="My account"
            onClick={closeAll}
            className="text-[#2b211b] transition-colors hover:text-[#b98b67]"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
            </svg>
          </Link>

          <Link
            to="/cart"
            aria-label="Cart"
            onClick={closeAll}
            className="relative text-[#2b211b] transition-colors hover:text-[#b98b67]"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 8h16l-1 13H5L4 8Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#6b4f3a] px-1 text-[9px] text-white">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </nav>

      {/* Desktop Dropdown (Mega Menu) */}
      {activeMenu === 'newArrivals' && (
        <div
          data-testid="new-arrivals-menu"
          className="absolute left-4 top-full z-10 hidden w-[226px] border-b border-[#e3d8cc] bg-[#f6f0e8] shadow-md lg:left-12 lg:block"
        >
          <div className="flex flex-col gap-3 px-6 py-6">
            {visibleNewArrivalsLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeAll}
                className="text-sm text-[#2b211b] transition-colors hover:text-[#b98b67]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {panel && (
        <div
          data-testid="mega-menu"
          className="absolute left-0 right-0 top-full hidden border-b border-[#e3d8cc] bg-[#f6f0e8] shadow-lg lg:block"
        >
          <div className={`mx-auto grid max-w-[1500px] gap-10 px-10 py-10 ${
            panel.clothing.length ? 'grid-cols-4' : 'grid-cols-3'
          }`}>

            {/* Featured */}
            <div>
              <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6f6258]">
                {panel.featuredTitle ?? 'Featured'}
              </h3>

              <ul className="space-y-3 text-sm text-[#2b211b]">
                {panel.featured.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.to}
                      onClick={closeAll}
                      className="transition-colors hover:text-[#b98b67] hover:underline hover:underline-offset-4"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clothing */}
            {panel.clothing.length > 0 && (
              <div>
                <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6f6258]">
                  Clothing
                </h3>

                <ul className="space-y-3 text-sm">
                  {panel.clothing.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.to}
                        onClick={closeAll}
                        className="transition-colors hover:text-[#b98b67] hover:underline hover:underline-offset-4"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Promo Image Tiles */}
            {panel.promos.map((promo) => (
              <Link
                key={promo.name}
                to={promo.to}
                onClick={closeAll}
                className="group block"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-white">
                  <ProductImage
                    src={promo.image}
                    alt={promo.name}
                    className="h-full w-full transition duration-500 group-hover:scale-105"
                  />
                </div>

                <p className="mt-3 text-sm font-medium uppercase tracking-[0.12em] text-[#2b211b]">
                  {promo.name}
                </p>

                <p className="text-xs text-[#6f6258]">
                  {promo.note}
                </p>
              </Link>
            ))}

          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-[#e3d8cc] bg-[#f6f0e8] px-6 py-6 lg:hidden">
          <div className="flex flex-col gap-5 text-sm">

            <button
              type="button"
              aria-expanded={openSection === 'newArrivals'}
              onClick={() =>
                setOpenSection(openSection === 'newArrivals' ? null : 'newArrivals')
              }
              className="flex w-full items-center justify-between text-left transition hover:opacity-50"
            >
              <span>NEW IN</span>
              <span className="text-lg leading-none">
                {openSection === 'newArrivals' ? '−' : '+'}
              </span>
            </button>

            {openSection === 'newArrivals' && (
              <div className="flex flex-col gap-4 border-l border-gray-200 pl-4 text-gray-600">
                {visibleNewArrivalsLinks.map((item) => (
                  <Link key={item.to} to={item.to} onClick={closeAll}>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Men / Women (accordion) */}
            {visibleMenus.map(([key, menu]) => (
              <div key={key}>
                <button
                  type="button"
                  aria-expanded={openSection === key}
                  onClick={() =>
                    setOpenSection(openSection === key ? null : key)
                  }
                  className="flex w-full items-center justify-between transition hover:opacity-50"
                >
                  <span>{menu.label}</span>
                  <span className="text-lg leading-none">
                    {openSection === key ? '−' : '+'}
                  </span>
                </button>

                {openSection === key && (
                  <div className="mt-4 flex flex-col gap-4 border-l border-gray-200 pl-4 text-gray-600">
                    {key === 'sale' ? (
                      menu.featured.map((item) => (
                        <Link key={item.to} to={item.to} onClick={closeAll}>
                          {item.name}
                        </Link>
                      ))
                    ) : (
                      <>
                        <Link to={menu.to} onClick={closeAll}>
                          Shop All {menu.label === 'MEN' ? 'Men' : 'Women'}
                        </Link>

                        {menu.clothing.map((item) => (
                          <Link
                            key={item.name}
                            to={item.to}
                            onClick={closeAll}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-2 flex gap-6 border-t border-gray-200 pt-5">

              <Link to={searchPath} onClick={closeAll} className="text-xs">
                SEARCH
              </Link>

              <Link to="/wishlist" onClick={closeAll} className="text-xs">
                WISHLIST
              </Link>

              <Link to="/cart" onClick={closeAll} className="text-xs">
                CART
              </Link>

            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar