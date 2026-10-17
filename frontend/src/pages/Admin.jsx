import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'

const orderStatuses = [
  'placed',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
]
const orderStatusLabel = (status) =>
  status === 'placed' ? 'Pending' : `${status[0].toUpperCase()}${status.slice(1)}`
const tabs = [
  ['overview', 'Overview'],
  ['products', 'Products'],
  ['categories', 'Categories'],
  ['orders', 'Orders'],
  ['customers', 'Customers'],
]
const pageSize = 8
const emptyProduct = {
  name: '',
  description: '',
  price: '',
  oldPrice: '',
  category: '',
  gender: 'women',
  image: '',
  color: '',
  sizes: 'S, M, L, XL',
  stockQuantity: '1',
  status: 'active',
  featured: false,
  bestseller: false,
}
const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function Admin() {
  const { user, signOut } = useAuth()
  const { reload: reloadStoreProducts } = useProducts()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [recentCustomers, setRecentCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [productForm, setProductForm] = useState(emptyProduct)
  const [showProductForm, setShowProductForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [categoryName, setCategoryName] = useState('')
  const [categoryGender, setCategoryGender] = useState('women')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [orderFrom, setOrderFrom] = useState('')
  const [orderTo, setOrderTo] = useState('')
  const [customerDetail, setCustomerDetail] = useState(null)

  const fetchDashboard = useCallback(async () => {
    try {
      const [dashboardResult, productResult, orderResult, customerResult, categoryResult] =
        await Promise.all([
          apiRequest('/admin/dashboard'),
          apiRequest('/admin/products'),
          apiRequest('/admin/orders'),
          apiRequest('/admin/customers'),
          apiRequest('/admin/categories'),
        ])
      setError('')
      setStats(dashboardResult.stats)
      setRecentOrders(dashboardResult.recentOrders ?? [])
      setRecentCustomers(dashboardResult.recentCustomers ?? [])
      setProducts(productResult.products ?? [])
      setOrders(orderResult.orders ?? [])
      setCustomers(customerResult.customers ?? [])
      setCategories(categoryResult.categories ?? [])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const visibleProducts = useMemo(() => {
    const value = search.toLowerCase()
    return products.filter((product) =>
      `${product.name} ${product.category} ${product.gender}`.toLowerCase().includes(value),
    )
  }, [products, search])

  const visibleOrders = useMemo(() => {
    const value = search.toLowerCase()
    return orders.filter((order) => {
      const matchesSearch = `${order.id} ${order.customer?.name ?? ''} ${order.customer?.email ?? ''}`
        .toLowerCase()
        .includes(value)
      const orderDate = (order.createdAt ?? '').slice(0, 10)
      return matchesSearch
        && (orderStatusFilter === 'all' || order.status === orderStatusFilter)
        && (!orderFrom || orderDate >= orderFrom)
        && (!orderTo || orderDate <= orderTo)
    })
  }, [orders, search, orderStatusFilter, orderFrom, orderTo])

  const visibleCustomers = useMemo(() => {
    const value = search.toLowerCase()
    return customers.filter((customer) =>
      `${customer.name} ${customer.email} ${customer.phone ?? ''}`.toLowerCase().includes(value),
    )
  }, [customers, search])

  const visibleCategories = useMemo(() => {
    const value = search.toLowerCase()
    return categories.filter((category) =>
      `${category.name} ${category.gender}`.toLowerCase().includes(value),
    )
  }, [categories, search])

  const beginEdit = (product) => {
    setEditingId(product.id)
    setShowProductForm(true)
    setProductForm({
      name: product.name ?? '',
      description: product.description ?? '',
      price: String(product.price ?? ''),
      oldPrice: product.oldPrice == null ? '' : String(product.oldPrice),
      category: product.category ?? '',
      gender: product.gender ?? 'women',
      image: product.image ?? '',
      color: product.color ?? '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : 'S, M, L, XL',
      stockQuantity: String(product.stockQuantity ?? 0),
      status: product.status ?? 'active',
      featured: Boolean(product.featured),
      bestseller: Boolean(product.bestseller),
    })
    setNotice('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setProductForm(emptyProduct)
    setShowProductForm(false)
  }

  const handleSaveProduct = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    const payload = {
      ...productForm,
      name: productForm.name.trim(),
      description: productForm.description.trim(),
      category: productForm.category.trim(),
      image: productForm.image.trim(),
      color: productForm.color.trim(),
      price: Number(productForm.price),
      oldPrice: productForm.oldPrice === '' ? null : Number(productForm.oldPrice),
      stockQuantity: Number(productForm.stockQuantity),
      sizes: productForm.sizes.split(',').map((size) => size.trim()).filter(Boolean),
    }
    try {
      const path = editingId ? `/admin/products/${editingId}` : '/admin/products'
      const result = await apiRequest(path, {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      })
      setProducts((current) => editingId
        ? current.map((product) => product.id === editingId ? result.product : product)
        : [result.product, ...current])
      setNotice(editingId ? 'Product updated successfully.' : 'Product created successfully.')
      cancelEdit()
      await fetchDashboard()
      reloadStoreProducts()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (event) => {
    const image = event.target.files?.[0]
    if (!image) return
    setUploadingImage(true)
    setError('')
    try {
      const form = new FormData()
      form.append('image', image)
      const result = await apiRequest('/admin/uploads', { method: 'POST', body: form })
      setProductForm((current) => ({ ...current, image: result.image }))
      setNotice('Image uploaded.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Remove "${product.name}" from the storefront? Existing order history will be kept.`)) return
    setError('')
    setNotice('')
    try {
      const result = await apiRequest(`/admin/products/${product.id}`, { method: 'DELETE' })
      if (result.archived) {
        setProducts((current) => current.map((item) => item.id === product.id ? result.product : item))
        setNotice('Product removed from the storefront. Existing order history was kept.')
      } else {
        setProducts((current) => current.filter((item) => item.id !== product.id))
        setNotice('Product deleted.')
      }
      await fetchDashboard()
      reloadStoreProducts()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleOrderStatus = async (orderId, status) => {
    setError('')
    setNotice('')
    try {
      const result = await apiRequest(`/admin/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setOrders((current) => current.map((order) => order.id === orderId ? result.order : order))
      setNotice(`Order #${orderId} marked ${status}.`)
      await fetchDashboard()
      reloadStoreProducts()
    } catch (requestError) {
      setError(requestError.message)
      await fetchDashboard()
    }
  }

  const handleCreateCategory = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    try {
      const result = await apiRequest('/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name: categoryName, gender: categoryGender }),
      })
      setCategories((current) => [...current, { ...result.category, productCount: 0 }])
      setCategoryName('')
      setNotice('Category created.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleRenameCategory = async (category) => {
    const name = window.prompt('Enter the new category name:', category.name)
    if (!name || name.trim() === category.name) return
    setError('')
    setNotice('')
    try {
      const result = await apiRequest(`/admin/categories/${category.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, gender: category.gender }),
      })
      setCategories((current) => current.map((item) => item.id === category.id
        ? { ...result.category, productCount: item.productCount }
        : item))
      await fetchDashboard()
      setNotice('Category and linked products updated.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Delete the "${category.name}" category?`)) return
    setError('')
    try {
      await apiRequest(`/admin/categories/${category.id}`, { method: 'DELETE' })
      setCategories((current) => current.filter((item) => item.id !== category.id))
      setNotice('Category deleted.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const openCustomer = async (customerId) => {
    setError('')
    try {
      const result = await apiRequest(`/admin/customers/${customerId}`)
      setCustomerDetail(result.customer)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const toggleCustomer = async (customer) => {
    setError('')
    setNotice('')
    const status = customer.accountStatus === 'active' ? 'inactive' : 'active'
    try {
      const result = await apiRequest(`/admin/customers/${customer.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setCustomers((current) => current.map((item) => item.id === customer.id ? result.customer : item))
      setNotice(`Customer account ${status}.`)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleSignOut = () => {
    signOut()
    navigate('/admin/login', { replace: true })
  }

  const refreshDashboard = () => {
    setLoading(true)
    fetchDashboard()
  }

  const currentRows = activeTab === 'products'
    ? visibleProducts
    : activeTab === 'orders'
      ? visibleOrders
      : activeTab === 'customers'
        ? visibleCustomers
        : visibleCategories
  const pageCount = Math.max(1, Math.ceil(currentRows.length / pageSize))
  const visiblePage = Math.min(page, pageCount)
  const pageRows = currentRows.slice((visiblePage - 1) * pageSize, visiblePage * pageSize)
  const statsCards = stats ? [
    { label: 'Delivered order value', value: money.format(stats.revenue), note: 'COD orders delivered', accent: 'teal' },
    { label: 'Total orders', value: stats.totalOrders, note: 'All order statuses', accent: 'soft' },
    { label: 'Pending orders', value: stats.pendingOrders, note: 'Placed, confirmed, processing', accent: 'peach' },
    { label: 'Completed orders', value: stats.completedOrders, note: 'Delivered', accent: 'brown' },
    { label: 'Customers', value: stats.totalCustomers, note: 'Registered accounts', accent: 'soft' },
    { label: 'Products', value: stats.totalProducts, note: 'Catalog items', accent: 'teal' },
    { label: 'Low stock', value: stats.lowStockProducts, note: '5 units or fewer', accent: 'peach' },
  ] : []

  if (loading) {
    return <div className="admin-loading">Loading store data...</div>
  }

  return (
    <main className="admin-page">
      <div className="admin-dashboard-shell">
        <header className="admin-topbar">
          <Link to="/" className="brand-block">
            <span className="brand-badge">Z</span>
            <span><strong>ZELIA</strong><small>ADMIN PANEL</small></span>
          </Link>
          <label className="topbar-search">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1) }}
              placeholder={`Search ${activeTab}...`}
              aria-label={`Search ${activeTab}`}
            />
          </label>
          <button type="button" className="admin-refresh-button" onClick={refreshDashboard}>Refresh data</button>
        </header>

        <div className="admin-workspace">
          <aside className="admin-sidebar">
            <nav className="sidebar-menu" aria-label="Admin sections">
              {tabs.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setActiveTab(value); setCustomerDetail(null); setPage(1) }}
                  className={activeTab === value ? 'menu-item active' : 'menu-item'}
                >
                  {label}
                </button>
              ))}
            </nav>
            <div className="sidebar-footer">
              <div className="admin-user-row">
                <span className="user-badge">N</span>
                <div><strong>Naina Sain</strong><small>{user?.email}</small></div>
              </div>
              <button type="button" onClick={handleSignOut} className="logout-button">Sign out</button>
            </div>
          </aside>

          <section className="admin-main-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">ZELIA / {activeTab}</p>
                <h1>{activeTab === 'overview' ? 'Store overview' : tabs.find(([key]) => key === activeTab)?.[1]}</h1>
              </div>
              <div className="header-toolbar">
                <span className="header-chip">Live database data</span>
                <Link to="/" className="ghost-link">View storefront</Link>
              </div>
            </div>

            {error && <div className="admin-alert" role="alert">{error}</div>}
            {notice && <div className="admin-success" role="status">{notice}</div>}

            {activeTab === 'overview' && (
              <>
                <div className="stats-grid">
                  {statsCards.map((stat) => (
                    <article key={stat.label} className={`stat-card ${stat.accent}`}>
                      <div className="stat-label-row"><span>{stat.label}</span></div>
                      <strong>{stat.value}</strong>
                      <small>{stat.note}</small>
                    </article>
                  ))}
                </div>
                <div className="overview-lists">
                  <section className="content-panel">
                    <div className="section-head"><div><h2>Recent orders</h2><p>Latest activity from the store</p></div></div>
                    {recentOrders.length ? recentOrders.map((order) => (
                      <article className="overview-row" key={order.id}>
                        <div><strong>Order #{order.id}</strong><small>{order.customer.name} · {order.customer.email}</small></div>
                        <span className={`status-pill ${order.status}`}>{orderStatusLabel(order.status)}</span>
                        <strong>{money.format(order.total)}</strong>
                      </article>
                    )) : <p className="empty-state">No orders have been placed yet.</p>}
                  </section>
                  <section className="content-panel">
                    <div className="section-head"><div><h2>New customers</h2><p>Most recent registrations</p></div></div>
                    {recentCustomers.length ? recentCustomers.map((customer) => (
                      <article className="overview-row" key={customer.id}>
                        <div><strong>{customer.name}</strong><small>{customer.email}</small></div>
                        <small>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Date unavailable'}</small>
                      </article>
                    )) : <p className="empty-state">No customers have registered yet.</p>}
                  </section>
                </div>
                <p className="admin-data-note">Delivered order value is shown for COD orders; payment collection is not tracked by this checkout.</p>
              </>
            )}

            {activeTab === 'products' && (
              <section className="content-panel">
                <div className="section-head">
                  <div><h2>Product catalog</h2><p>Changes are saved to the same catalog shown on the storefront.</p></div>
                  <button type="button" className="admin-primary-button" onClick={() => {
                    if (showProductForm) cancelEdit()
                    else { setEditingId(null); setProductForm(emptyProduct); setShowProductForm(true) }
                  }}>{showProductForm ? 'Close form' : 'Add product'}</button>
                </div>
                {showProductForm && (
                  <form onSubmit={handleSaveProduct} className="product-form">
                    <div className="form-grid">
                      <label><span>Product name</span><input maxLength="150" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} required /></label>
                      <label><span>Category</span><input list="admin-category-options" maxLength="50" value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} required /><datalist id="admin-category-options">{categories.map((item) => <option key={item.id} value={item.name} />)}</datalist></label>
                      <label><span>Collection</span><select value={productForm.gender} onChange={(event) => setProductForm({ ...productForm, gender: event.target.value })}><option value="women">Women</option><option value="men">Men</option></select></label>
                      <label><span>Price (INR)</span><input type="number" min="1" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} required /></label>
                      <label><span>Discount / original price</span><input type="number" min="1" value={productForm.oldPrice} onChange={(event) => setProductForm({ ...productForm, oldPrice: event.target.value })} /></label>
                      <label><span>Color</span><input maxLength="30" value={productForm.color} onChange={(event) => setProductForm({ ...productForm, color: event.target.value })} /></label>
                      <label><span>Sizes (comma-separated)</span><input value={productForm.sizes} onChange={(event) => setProductForm({ ...productForm, sizes: event.target.value })} placeholder="S, M, L, XL" required /></label>
                      <label><span>Stock quantity</span><input type="number" min="0" value={productForm.stockQuantity} onChange={(event) => setProductForm({ ...productForm, stockQuantity: event.target.value })} required /></label>
                      <label><span>Product status</span><select value={productForm.status} onChange={(event) => setProductForm({ ...productForm, status: event.target.value })}><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
                      <label className="full-span"><span>Description</span><textarea maxLength="1000" value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} rows="3" /></label>
                      <label className="full-span"><span>Image URL</span><input maxLength="500" value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} placeholder="/images/... or upload an image below" /></label>
                      <label className="full-span"><span>Upload image (JPG, PNG, WebP · max 5 MB)</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} disabled={uploadingImage} />{uploadingImage && <small>Uploading image...</small>}</label>
                    </div>
                    <div className="form-actions">
                      <div className="product-flags">
                        <label><input type="checkbox" checked={productForm.featured} onChange={(event) => setProductForm({ ...productForm, featured: event.target.checked })} /> Featured</label>
                        <label><input type="checkbox" checked={productForm.bestseller} onChange={(event) => setProductForm({ ...productForm, bestseller: event.target.checked })} /> Bestseller</label>
                      </div>
                      <div className="action-buttons">
                        <button type="button" className="secondary-button" onClick={cancelEdit}>Cancel</button>
                        <button type="submit" className="admin-primary-button" disabled={saving || uploadingImage}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Create product'}</button>
                      </div>
                    </div>
                  </form>
                )}
                <div className="data-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {pageRows.map((product) => (
                        <tr key={product.id}>
                          <td><div className="product-cell"><span className="product-name">{product.name}</span><small>{product.gender} · {product.color || 'Color not set'}</small></div></td>
                          <td>{product.category}</td><td>{money.format(product.price)}</td>
                          <td>{product.stockQuantity} units</td><td>{product.status}</td>
                          <td><div className="table-actions"><button type="button" className="table-link" onClick={() => beginEdit(product)}>Edit</button><button type="button" className="table-link danger" onClick={() => handleDeleteProduct(product)}>Delete</button></div></td>
                        </tr>
                      ))}
                      {!pageRows.length && <tr><td colSpan="6" className="empty-row">No matching products.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <PageControls page={visiblePage} pageCount={pageCount} setPage={setPage} />
              </section>
            )}

            {activeTab === 'categories' && (
              <section className="content-panel">
                <div className="section-head"><div><h2>Categories & collections</h2><p>Categories are connected to products by collection and name.</p></div></div>
                <form className="category-create-form" onSubmit={handleCreateCategory}>
                  <label><span>Category name</span><input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} maxLength="50" required /></label>
                  <label><span>Collection</span><select value={categoryGender} onChange={(event) => setCategoryGender(event.target.value)}><option value="women">Women</option><option value="men">Men</option></select></label>
                  <button type="submit" className="admin-primary-button">Create category</button>
                </form>
                <div className="data-table-wrap">
                  <table className="admin-table"><thead><tr><th>Category</th><th>Collection</th><th>Products</th><th>Actions</th></tr></thead>
                    <tbody>{pageRows.map((category) => <tr key={category.id}><td>{category.name}</td><td>{category.gender}</td><td>{category.productCount}</td><td><div className="table-actions"><button type="button" className="table-link" onClick={() => handleRenameCategory(category)}>Rename</button><button type="button" className="table-link danger" onClick={() => handleDeleteCategory(category)}>Delete</button></div></td></tr>)}
                      {!pageRows.length && <tr><td colSpan="4" className="empty-row">No categories found.</td></tr>}</tbody></table>
                </div>
                <PageControls page={visiblePage} pageCount={pageCount} setPage={setPage} />
              </section>
            )}

            {activeTab === 'orders' && (
              <section className="content-panel">
                <div className="section-head"><div><h2>Orders</h2><p>COD is the only payment method currently supported.</p></div></div>
                <div className="order-filters">
                  <label><span>Status</span><select value={orderStatusFilter} onChange={(event) => { setOrderStatusFilter(event.target.value); setPage(1) }}><option value="all">All statuses</option>{orderStatuses.map((status) => <option key={status} value={status}>{orderStatusLabel(status)}</option>)}</select></label>
                  <label><span>From</span><input type="date" value={orderFrom} onChange={(event) => { setOrderFrom(event.target.value); setPage(1) }} /></label>
                  <label><span>To</span><input type="date" value={orderTo} onChange={(event) => { setOrderTo(event.target.value); setPage(1) }} /></label>
                </div>
                <div className="order-list">
                  {pageRows.map((order) => (
                    <article key={order.id} className="order-card">
                      <div className="order-meta-row">
                        <div><h3>Order #{order.id}</h3><p>{order.customer?.name} · {order.customer?.email} · {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</p></div>
                        <div className="order-status-wrap"><span className={`status-pill ${order.status}`}>{orderStatusLabel(order.status)}</span><select aria-label={`Update order ${order.id} status`} value={order.status} onChange={(event) => handleOrderStatus(order.id, event.target.value)}>{orderStatuses.map((status) => <option key={status} value={status}>{orderStatusLabel(status)}</option>)}</select></div>
                      </div>
                      <div className="order-body">
                        <div className="order-address"><strong>{money.format(order.total)}</strong><br /><span>{order.paymentMethod} · Payment {order.paymentStatus}</span><br /><span>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}, {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</span></div>
                        <ul>{(order.items ?? []).map((item, index) => <li key={`${order.id}-${index}`}>{item.name} · Size {item.size || 'not recorded'} · {item.quantity} × {money.format(item.price)}</li>)}</ul>
                      </div>
                    </article>
                  ))}
                  {!pageRows.length && <p className="empty-state">No orders match these filters.</p>}
                </div>
                <PageControls page={visiblePage} pageCount={pageCount} setPage={setPage} />
              </section>
            )}

            {activeTab === 'customers' && (
              <section className="content-panel">
                <div className="section-head"><div><h2>Registered customers</h2><p>Only customer-provided profile and order data is shown.</p></div></div>
                <div className="customer-grid">
                  {pageRows.map((customer) => (
                    <article key={customer.id} className="customer-card">
                      <div className="customer-avatar">{(customer.name || 'C').slice(0, 1).toUpperCase()}</div>
                      <div><h3>{customer.name}</h3><p>{customer.email}</p><small>{customer.phone || 'No phone provided'} · Joined {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'date unavailable'}</small></div>
                      <div className="customer-metrics"><span>{customer.orders} orders</span><strong>{money.format(customer.totalSpent)}</strong></div>
                      <span className={`status-pill ${customer.accountStatus}`}>{customer.accountStatus}</span>
                      <div className="table-actions"><button type="button" className="table-link" onClick={() => openCustomer(customer.id)}>Details & history</button><button type="button" className="table-link" onClick={() => toggleCustomer(customer)}>{customer.accountStatus === 'active' ? 'Deactivate' : 'Activate'}</button></div>
                    </article>
                  ))}
                  {!pageRows.length && <p className="empty-state">No registered customers match this search.</p>}
                </div>
                <PageControls page={visiblePage} pageCount={pageCount} setPage={setPage} />
                {customerDetail && (
                  <section className="customer-detail-panel">
                    <div className="section-head"><div><h2>{customerDetail.name}</h2><p>{customerDetail.email} · {customerDetail.accountStatus}</p></div><button type="button" className="secondary-button" onClick={() => setCustomerDetail(null)}>Close details</button></div>
                    <h3>Saved addresses</h3>
                    {customerDetail.savedAddresses.length ? customerDetail.savedAddresses.map((address) => <p key={address.id}>{address.firstName} {address.lastName} · {address.phone} · {address.address}, {address.city}, {address.state} {address.pincode}</p>) : <p>No saved addresses.</p>}
                    <h3>Order history</h3>
                    {customerDetail.orderHistory.length ? customerDetail.orderHistory.map((order) => <p key={order.id}>Order #{order.id} · {orderStatusLabel(order.status)} · {money.format(order.total)} · {new Date(order.createdAt).toLocaleDateString()}</p>) : <p>This customer has not placed an order.</p>}
                  </section>
                )}
              </section>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function PageControls({ page, pageCount, setPage }) {
  if (pageCount < 2) return null
  return (
    <div className="admin-pagination">
      <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
      <span>Page {page} of {pageCount}</span>
      <button type="button" disabled={page >= pageCount} onClick={() => setPage(page + 1)}>Next</button>
    </div>
  )
}

export default Admin
