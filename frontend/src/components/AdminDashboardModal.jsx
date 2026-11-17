import { useState, useEffect } from 'react';
import './AdminDashboardModal.css';

function AdminDashboardModal({
  isOpen,
  onClose,
  authToken,
  jerseys = [],
  onRefreshJerseys
}) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders'

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  // Add Jersey Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJerseyName, setNewJerseyName] = useState('');
  const [newJerseyTeam, setNewJerseyTeam] = useState('Real Madrid');
  const [newJerseyLeague, setNewJerseyLeague] = useState('La Liga');
  const [newJerseySeason, setNewJerseySeason] = useState('24/25');
  const [newJerseyKitType, setNewJerseyKitType] = useState('Home');
  const [newJerseyPrice, setNewJerseyPrice] = useState('899');
  const [newJerseyOriginalPrice, setNewJerseyOriginalPrice] = useState('1499');
  const [newJerseyImageUrl, setNewJerseyImageUrl] = useState('/images/jerseys/real-madrid-home.jpg');
  const [newJerseyDescription, setNewJerseyDescription] = useState('');
  const [isAddingJersey, setIsAddingJersey] = useState(false);
  const [adminActionError, setAdminActionError] = useState('');
  const [adminActionSuccess, setAdminActionSuccess] = useState('');

  useEffect(() => {
    if (isOpen && authToken && activeTab === 'orders') {
      fetchAdminOrders();
    }
  }, [isOpen, authToken, activeTab]);

  async function fetchAdminOrders() {
    try {
      setOrdersLoading(true);
      setOrdersError('');
      const res = await fetch('http://localhost:8081/api/orders', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to load orders (${res.status} ${res.statusText})`);
      }
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setOrdersError(err.message || 'Unable to fetch orders.');
    } finally {
      setOrdersLoading(false);
    }
  }

  async function handleToggleStock(jerseyId) {
    try {
      setAdminActionError('');
      setAdminActionSuccess('');
      const res = await fetch(`http://localhost:8081/api/jerseys/${jerseyId}/toggle-stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to toggle stock status.');
      }
      setAdminActionSuccess('Stock status updated successfully!');
      if (onRefreshJerseys) onRefreshJerseys();
    } catch (err) {
      setAdminActionError(err.message || 'Could not update stock.');
    }
  }

  async function handleDeleteJersey(jerseyId, jerseyName) {
    if (!window.confirm(`Are you sure you want to delete "${jerseyName}" from the vault?`)) {
      return;
    }
    try {
      setAdminActionError('');
      setAdminActionSuccess('');
      const res = await fetch(`http://localhost:8081/api/jerseys/${jerseyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to delete jersey.');
      }
      setAdminActionSuccess(`"${jerseyName}" removed from vault.`);
      if (onRefreshJerseys) onRefreshJerseys();
    } catch (err) {
      setAdminActionError(err.message || 'Could not delete jersey.');
    }
  }

  async function handleAddJerseySubmit(e) {
    e.preventDefault();
    setAdminActionError('');
    setAdminActionSuccess('');

    if (!newJerseyName.trim()) {
      setAdminActionError('Jersey name is required.');
      return;
    }

    try {
      setIsAddingJersey(true);
      const payload = {
        name: newJerseyName.trim(),
        team: newJerseyTeam.trim(),
        league: newJerseyLeague.trim(),
        season: newJerseySeason.trim(),
        kitType: newJerseyKitType.trim(),
        price: Number(newJerseyPrice),
        originalPrice: Number(newJerseyOriginalPrice),
        imageUrl: newJerseyImageUrl.trim() || '/images/jerseys/real-madrid-home.jpg',
        description: newJerseyDescription.trim() || `${newJerseyTeam} ${newJerseySeason} official merchandise.`,
        inStock: true,
        featured: true
      };

      const res = await fetch('http://localhost:8081/api/jerseys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create new jersey.');
      }

      setAdminActionSuccess(`✨ "${newJerseyName}" added to the vault catalog!`);
      setShowAddForm(false);
      setNewJerseyName('');
      setNewJerseyDescription('');
      if (onRefreshJerseys) onRefreshJerseys();
    } catch (err) {
      setAdminActionError(err.message || 'Failed to add jersey.');
    } finally {
      setIsAddingJersey(false);
    }
  }

  async function handleUpdateOrderStatus(orderCode, newStatus) {
    try {
      setOrdersError('');
      const res = await fetch(`http://localhost:8081/api/orders/${orderCode}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) {
        throw new Error('Failed to update order status.');
      }
      // Refresh admin orders list
      await fetchAdminOrders();
    } catch (err) {
      setOrdersError(err.message || 'Could not update status.');
    }
  }

  if (!isOpen) return null;

  // Calculate platform metrics
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const paidOrdersCount = orders.filter((o) => o.paymentStatus === 'PAID').length;

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="admin-close-btn"
          onClick={onClose}
          aria-label="Close admin dashboard"
        >
          ✕
        </button>

        <div className="admin-header">
          <div className="admin-kicker-group">
            <span className="admin-kicker">VAULT MANAGEMENT</span>
            <span className="admin-role-badge">ROLE_ADMIN</span>
          </div>
          <h2 className="admin-title">Store Manager Dashboard</h2>
          <p className="admin-subtitle">
            Control vault inventory, toggle live stock, and manage customer order fulfillment.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('inventory');
              setAdminActionError('');
              setAdminActionSuccess('');
            }}
          >
            👕 Vault Inventory ({jerseys.length} Kits)
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('orders');
              setAdminActionError('');
              setAdminActionSuccess('');
            }}
          >
            📦 Customer Orders ({orders.length})
          </button>
        </div>

        {adminActionError && (
          <div className="admin-banner error">⚠️ {adminActionError}</div>
        )}
        {adminActionSuccess && (
          <div className="admin-banner success">✅ {adminActionSuccess}</div>
        )}

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="admin-inventory-section">
            <div className="inventory-actions-bar">
              <span className="inventory-summary-text">
                Showing <strong>{jerseys.length}</strong> active kits in MySQL
              </span>
              <button
                type="button"
                className="add-kit-toggle-btn"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? '✕ Cancel Form' : '➕ Add New Vault Jersey'}
              </button>
            </div>

            {/* Add New Jersey Drawer / Form */}
            {showAddForm && (
              <form onSubmit={handleAddJerseySubmit} className="add-jersey-form">
                <h4 className="form-legend">Add New Kit to MySQL Database</h4>

                <div className="form-row-2">
                  <div className="form-input-group">
                    <label>Kit Title *</label>
                    <input
                      type="text"
                      placeholder="e.g., Liverpool 2024/25 Authentic Home Kit"
                      value={newJerseyName}
                      onChange={(e) => setNewJerseyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-input-group">
                    <label>Club / National Team *</label>
                    <input
                      type="text"
                      placeholder="e.g., Liverpool"
                      value={newJerseyTeam}
                      onChange={(e) => setNewJerseyTeam(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-4">
                  <div className="form-input-group">
                    <label>League *</label>
                    <select
                      value={newJerseyLeague}
                      onChange={(e) => setNewJerseyLeague(e.target.value)}
                    >
                      <option value="Premier League">Premier League</option>
                      <option value="La Liga">La Liga</option>
                      <option value="Serie A">Serie A</option>
                      <option value="International">International</option>
                      <option value="Retro">Retro Classics</option>
                    </select>
                  </div>
                  <div className="form-input-group">
                    <label>Season</label>
                    <input
                      type="text"
                      value={newJerseySeason}
                      onChange={(e) => setNewJerseySeason(e.target.value)}
                    />
                  </div>
                  <div className="form-input-group">
                    <label>Price (₹ INR) *</label>
                    <input
                      type="number"
                      value={newJerseyPrice}
                      onChange={(e) => setNewJerseyPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-input-group">
                    <label>Original (₹ Strikethrough)</label>
                    <input
                      type="number"
                      value={newJerseyOriginalPrice}
                      onChange={(e) => setNewJerseyOriginalPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-input-group">
                  <label>Image URL Path</label>
                  <input
                    type="text"
                    placeholder="/images/jerseys/real-madrid-home.jpg"
                    value={newJerseyImageUrl}
                    onChange={(e) => setNewJerseyImageUrl(e.target.value)}
                  />
                </div>

                <div className="form-input-group">
                  <label>Description &amp; Tech Fabric Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Official moisture-absorbing AEROREADY / Dri-FIT ADV match jersey..."
                    value={newJerseyDescription}
                    onChange={(e) => setNewJerseyDescription(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="submit-jersey-btn"
                  disabled={isAddingJersey}
                >
                  {isAddingJersey ? 'SAVING TO MYSQL...' : 'SAVE & PUBLISH TO STOREFRONT ⚡'}
                </button>
              </form>
            )}

            {/* Jerseys Grid Table */}
            <div className="admin-kits-list">
              {jerseys.map((jersey) => (
                <div key={jersey.id} className="admin-kit-card">
                  <img
                    src={jersey.imageUrl}
                    alt={jersey.name}
                    className="admin-kit-thumb"
                  />
                  <div className="admin-kit-info">
                    <span className="admin-kit-team">{jersey.team} • {jersey.league}</span>
                    <h5 className="admin-kit-name">{jersey.name}</h5>
                    <div className="admin-kit-meta">
                      <span className="admin-kit-price">₹{Number(jersey.price)}</span>
                      {jersey.originalPrice && (
                        <span className="admin-kit-strikethrough">₹{Number(jersey.originalPrice)}</span>
                      )}
                      <span className={`stock-status-pill ${jersey.inStock ? 'in' : 'out'}`}>
                        {jersey.inStock ? '🟢 In Stock' : '🔴 Out of Stock'}
                      </span>
                    </div>
                  </div>

                  <div className="admin-kit-actions">
                    <button
                      type="button"
                      className={`toggle-stock-btn ${jersey.inStock ? 'make-out' : 'make-in'}`}
                      onClick={() => handleToggleStock(jersey.id)}
                      title="Toggle live stock availability"
                    >
                      {jersey.inStock ? 'Mark Sold Out' : 'Mark In Stock'}
                    </button>
                    <button
                      type="button"
                      className="delete-kit-btn"
                      onClick={() => handleDeleteJersey(jersey.id, jersey.name)}
                      title="Delete jersey from catalog"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ALL CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="admin-orders-section">
            {/* Quick Metrics Bar */}
            <div className="admin-metrics-grid">
              <div className="metric-box">
                <span className="metric-label">TOTAL ORDERS</span>
                <span className="metric-val">{orders.length}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">TOTAL PLATFORM REVENUE</span>
                <span className="metric-val green">₹{totalRevenue}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">VERIFIED PAID ORDERS</span>
                <span className="metric-val blue">{paidOrdersCount}</span>
              </div>
            </div>

            {ordersError && (
              <div className="admin-banner error">⚠️ {ordersError}</div>
            )}

            {ordersLoading ? (
              <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading all orders from MySQL database...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="admin-empty">
                <p>No orders recorded in the vault yet.</p>
              </div>
            ) : (
              <div className="admin-orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="admin-order-row-card">
                    <div className="admin-order-header">
                      <div>
                        <span className="order-code-badge">{order.orderCode}</span>
                        <span className="order-customer-sub">
                          {order.customerName} ({order.customerPhone}) • {order.city}
                        </span>
                      </div>

                      <div className="order-actions-col">
                        <span className="order-amount-tag">₹{Number(order.totalAmount)}</span>
                        <span className={`payment-pill ${order.paymentStatus === 'PAID' ? 'paid' : 'pending'}`}>
                          {order.paymentMethod} • {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="admin-order-body">
                      <div className="order-items-snippet">
                        {order.items?.map((it) => (
                          <span key={it.id} className="kit-chip">
                            {it.jerseyName} ({it.size}) × {it.quantity}
                            {it.customName ? ` [${it.customName} #${it.customNumber}]` : ''}
                          </span>
                        ))}
                      </div>

                      {/* Fulfillment Status Modifier */}
                      <div className="status-modifier-group">
                        <label>Fulfillment Status:</label>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order.orderCode, e.target.value)}
                          className="status-select"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING (Flocking &amp; QC)</option>
                          <option value="SHIPPED">SHIPPED (BlueDart In Transit)</option>
                          <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardModal;
