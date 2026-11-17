import { useState, useEffect } from 'react';
import './MyOrdersModal.css';

function MyOrdersModal({ isOpen, onClose, authToken, user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && authToken) {
      fetchMyOrders();
    }
  }, [isOpen, authToken]);

  async function fetchMyOrders() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8081/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load orders (${response.status})`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Unable to retrieve order history.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="orders-overlay" onClick={onClose}>
      <div className="orders-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="orders-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="orders-header">
          <span className="orders-kicker">AUTHENTICATED WITH JWT</span>
          <h3 className="orders-title">My Matchday Orders</h3>
          <p className="orders-subtitle">
            Order history and tracking for <strong>{user?.name || user?.email}</strong>
          </p>
        </div>

        {loading ? (
          <div className="orders-loading">
            <div className="loading-spinner"></div>
            <p>Fetching verified order receipts from MySQL...</p>
          </div>
        ) : error ? (
          <div className="orders-error">
            <p>⚠️ {error}</p>
            <button type="button" className="retry-orders-btn" onClick={fetchMyOrders}>
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <span className="empty-orders-icon">📦</span>
            <h4>No matchday orders placed yet</h4>
            <p>Your official club jerseys and custom kits will appear here once confirmed.</p>
            <button type="button" className="explore-btn" onClick={onClose}>
              EXPLORE VAULT KITS →
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-receipt-card">
                <div className="order-receipt-top">
                  <div>
                    <span className="order-ref-label">ORDER REFERENCE</span>
                    <div className="order-code-val">{order.orderCode}</div>
                    <span className="order-date-val">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Recent'}
                    </span>
                  </div>

                  <div className="order-badges">
                    <span className="order-badge status">{order.orderStatus}</span>
                    <span className="order-badge method">
                      {order.paymentMethod} • {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="order-card-divider"></div>

                <ul className="order-items-sublist">
                  {order.items?.map((item) => (
                    <li key={item.id} className="order-item-row">
                      <div className="order-item-desc">
                        <span className="item-title">
                          {item.jerseyName} (Size: <strong>{item.size}</strong>) × {item.quantity}
                        </span>
                        {(item.customName || item.customNumber) && (
                          <span className="item-flocking">
                            ✨ {item.customName} #{item.customNumber}
                            {item.fontFinish === 'gold-foil' ? ' • Gold Foil' : ''}
                            {item.sleevePatch && item.sleevePatch !== 'none'
                              ? ` • ${item.sleevePatch.toUpperCase()} Patch`
                              : ''}
                          </span>
                        )}
                      </div>
                      <span className="item-line-price">₹{Number(item.lineTotal)}</span>
                    </li>
                  ))}
                </ul>

                <div className="order-card-divider"></div>

                <div className="order-receipt-footer">
                  <div className="order-delivery-address">
                    <span className="address-label">DELIVERED TO:</span>
                    <p>
                      {order.shippingAddress}, {order.city} — {order.pincode}
                    </p>
                  </div>
                  <div className="order-total-due">
                    <span className="total-label">ORDER TOTAL</span>
                    <span className="total-val">₹{Number(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrdersModal;
