import { useState, useEffect } from 'react';
import './MyOrdersModal.css';

function MyOrdersModal({
  isOpen,
  onClose,
  authToken,
  user,
  jerseys = [],
  onOpenJerseyDetails
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payingOrderCode, setPayingOrderCode] = useState(null);
  const [payError, setPayError] = useState('');
  const [activeTrackingCode, setActiveTrackingCode] = useState(null);

  useEffect(() => {
    if (isOpen && authToken) {
      fetchMyOrders();
    }
  }, [isOpen, authToken]);

  async function fetchMyOrders() {
    try {
      setLoading(true);
      setError(null);
      setPayError('');

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
      // Automatically expand tracking for the most recent order
      if (data && data.length > 0 && !activeTrackingCode) {
        setActiveTrackingCode(data[0].orderCode);
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve order history.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePayPendingOrder(order) {
    if (!window.Razorpay) {
      setPayError('Razorpay SDK is loading. Please check your internet connection.');
      return;
    }

    try {
      setPayingOrderCode(order.orderCode);
      setPayError('');

      // Step 1: Create or fetch gateway order for this existing order
      const res = await fetch(`http://localhost:8081/api/orders/${order.orderCode}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });

      const rzpData = await res.json();
      if (!res.ok) {
        throw new Error(rzpData.message || 'Unable to initiate payment.');
      }

      // Step 2: Launch official Razorpay Checkout popup
      const options = {
        key: rzpData.keyId,
        amount: rzpData.amountInPaise,
        currency: rzpData.currency || 'INR',
        name: 'Jersey4U — The Football Vault',
        description: `Payment for Order ${order.orderCode}`,
        order_id: rzpData.razorpayOrderId,
        prefill: {
          name: rzpData.customerName || user?.name || '',
          email: rzpData.customerEmail || user?.email || '',
          contact: rzpData.customerPhone || user?.phone || ''
        },
        theme: {
          color: '#0f172a'
        },
        handler: async function (rzpResponse) {
          try {
            // Step 3: Verify HMAC-SHA256 signature on Spring Boot backend
            const verifyRes = await fetch('http://localhost:8081/api/orders/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: rzpResponse.razorpay_order_id,
                razorpayPaymentId: rzpResponse.razorpay_payment_id,
                razorpaySignature: rzpResponse.razorpay_signature
              })
            });

            if (!verifyRes.ok) {
              const errData = await verifyRes.json();
              throw new Error(errData.message || 'Payment signature verification failed.');
            }

            // Successfully paid! Refresh orders list live
            await fetchMyOrders();
          } catch (vErr) {
            setPayError(vErr.message || 'Payment verification failed on server.');
          } finally {
            setPayingOrderCode(null);
          }
        },
        modal: {
          ondismiss: function () {
            setPayingOrderCode(null);
          }
        }
      };

      const popup = new window.Razorpay(options);
      popup.on('payment.failed', function (failRes) {
        setPayingOrderCode(null);
        setPayError(failRes.error?.description || 'Payment was not completed.');
      });
      popup.open();
    } catch (err) {
      setPayingOrderCode(null);
      setPayError(err.message || 'Payment initiation failed.');
    }
  }

  function getEstimatedDeliveryDate(createdDateStr) {
    const d = createdDateStr ? new Date(createdDateStr) : new Date();
    d.setDate(d.getDate() + 4);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function getTrackingNumber(orderCode) {
    const digits = orderCode.replace(/\D/g, '') || '883921';
    return `BD-IN-78${digits}`;
  }

  function getStepLevel(status) {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'CONFIRMED':
      case 'CREATED':
      case 'PENDING':
        return 1;
      case 'PROCESSING':
        return 2;
      case 'SHIPPED':
      case 'DISPATCHED':
        return 3;
      case 'OUT_FOR_DELIVERY':
        return 4;
      case 'DELIVERED':
      case 'COMPLETED':
        return 5;
      default:
        return 1;
    }
  }

  function getStepStatusClass(stepIndex, orderStatus) {
    const currentLevel = getStepLevel(orderStatus);
    if (currentLevel === 5) {
      return 'completed';
    }
    if (stepIndex < currentLevel) {
      return 'completed';
    }
    if (stepIndex === currentLevel) {
      return 'active';
    }
    return 'upcoming';
  }

  function getStepCircleContent(stepIndex, orderStatus) {
    const statusClass = getStepStatusClass(stepIndex, orderStatus);
    if (statusClass === 'completed') {
      return '✓';
    }
    return stepIndex;
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
          <span className="orders-kicker">AUTHENTICATED • SPRING SECURITY 6</span>
          <h3 className="orders-title">My Matchday Orders</h3>
          <p className="orders-subtitle">
            Order history, live tracking, and single-click payment for <strong>{user?.name || user?.email}</strong>
          </p>
        </div>

        {payError && (
          <div className="orders-pay-error-banner">
            ⚠️ {payError}
          </div>
        )}

        {loading ? (
          <div className="orders-loading">
            <div className="loading-spinner"></div>
            <p>Fetching verified order receipts from MySQL...</p>
          </div>
        ) : error ? (
          <div className="orders-error">
            <p>⚠️ {error}</p>
            <button type="button" className="retry-orders-btn" onClick={fetchMyOrders}>
              Retry Connection
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <span className="empty-orders-icon">📦</span>
            <h4>No matchday orders placed yet</h4>
            <p>Your official club jerseys and custom flocking kits will appear here once confirmed.</p>
            <button type="button" className="explore-btn" onClick={onClose}>
              EXPLORE VAULT KITS →
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const isPaid = order.paymentStatus === 'PAID';
              const isCod = order.paymentMethod === 'COD';
              const isExpanded = activeTrackingCode === order.orderCode;

              return (
                <div key={order.id} className="order-receipt-card">
                  {/* Top Header Row */}
                  <div className="order-receipt-top">
                    <div>
                      <span className="order-ref-label">ORDER REFERENCE</span>
                      <div className="order-code-val">{order.orderCode}</div>
                      <span className="order-date-val">
                        Placed on{' '}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Recent'}
                      </span>
                    </div>

                    <div className="order-badges">
                      <span className="order-badge status">{order.orderStatus}</span>
                      <span className={`order-badge method ${isPaid ? 'paid' : 'pending'}`}>
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Pending Payment Alert & Instant Pay Button */}
                  {!isPaid && (
                    <div className="pending-payment-alert-box">
                      <div className="pending-text-col">
                        <span className="pending-title">
                          {isCod ? '📦 Cash on Delivery Order' : '⏳ Payment Pending'}
                        </span>
                        <span className="pending-desc">
                          {isCod
                            ? `Amount due at doorstep: ₹${Number(order.totalAmount)}. You can also pay online right now!`
                            : `Complete payment of ₹${Number(order.totalAmount)} with Razorpay to expedite dispatch.`}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="pay-now-order-btn"
                        onClick={() => handlePayPendingOrder(order)}
                        disabled={payingOrderCode === order.orderCode}
                      >
                        {payingOrderCode === order.orderCode
                          ? 'OPENING GATEWAY...'
                          : `⚡ PAY ₹${Number(order.totalAmount)} WITH RAZORPAY`}
                      </button>
                    </div>
                  )}

                  {/* Toggle Tracking Timeline */}
                  <div className="tracking-toggle-row">
                    <button
                      type="button"
                      className="tracking-toggle-btn"
                      onClick={() =>
                        setActiveTrackingCode(isExpanded ? null : order.orderCode)
                      }
                    >
                      <span>🚚 Package Tracking &amp; Delivery Timeline</span>
                      <span className="toggle-arrow">{isExpanded ? '▴' : '▾'}</span>
                    </button>
                  </div>

                  {/* Visual Multi-Step Tracking Timeline */}
                  {isExpanded && (
                    <div className="tracking-timeline-box">
                      <div className="tracking-meta-header">
                        <div>
                          <span className="meta-label">COURIER PARTNER</span>
                          <span className="meta-val">BlueDart Express</span>
                        </div>
                        <div>
                          <span className="meta-label">AWB / TRACKING NO.</span>
                          <span className="meta-val mono">{getTrackingNumber(order.orderCode)}</span>
                        </div>
                        <div>
                          <span className="meta-label">ESTIMATED DELIVERY</span>
                          <span className="meta-val green">{getEstimatedDeliveryDate(order.createdAt)}</span>
                        </div>
                      </div>

                      {order.orderStatus === 'CANCELLED' ? (
                        <div className="order-cancelled-timeline">
                          <span>❌ This order has been cancelled by the store administrator. Any amount paid will be refunded within 3-5 business days.</span>
                        </div>
                      ) : (
                        <div className="timeline-steps">
                          {/* Step 1: Confirmed */}
                          <div className={`timeline-step ${getStepStatusClass(1, order.orderStatus)}`}>
                            <div className={`step-circle ${getStepStatusClass(1, order.orderStatus) === 'active' ? 'pulse' : ''}`}>
                              {getStepCircleContent(1, order.orderStatus)}
                            </div>
                            <div className="step-content">
                              <span className="step-title">Order Confirmed</span>
                              <span className="step-sub">Verified &amp; logged in MySQL Vault</span>
                            </div>
                          </div>

                          {/* Step 2: Flocking & Quality */}
                          <div className={`timeline-step ${getStepStatusClass(2, order.orderStatus)}`}>
                            <div className={`step-circle ${getStepStatusClass(2, order.orderStatus) === 'active' ? 'pulse' : ''}`}>
                              {getStepCircleContent(2, order.orderStatus)}
                            </div>
                            <div className="step-content">
                              <span className="step-title">Flocking &amp; Quality Inspection</span>
                              <span className="step-sub">Applying official badges and printing</span>
                            </div>
                          </div>

                          {/* Step 3: Handed to BlueDart Express */}
                          <div className={`timeline-step ${getStepStatusClass(3, order.orderStatus)}`}>
                            <div className={`step-circle ${getStepStatusClass(3, order.orderStatus) === 'active' ? 'pulse' : ''}`}>
                              {getStepCircleContent(3, order.orderStatus)}
                            </div>
                            <div className="step-content">
                              <span className="step-title">Handed to BlueDart Express</span>
                              <span className="step-sub">Dispatched from Mumbai hub</span>
                            </div>
                          </div>

                          {/* Step 4: Out for Delivery / Delivered */}
                          <div className={`timeline-step ${getStepStatusClass(4, order.orderStatus)}`}>
                            <div className={`step-circle ${getStepStatusClass(4, order.orderStatus) === 'active' ? 'pulse' : ''}`}>
                              {getStepCircleContent(4, order.orderStatus)}
                            </div>
                            <div className="step-content">
                              <span className="step-title">
                                {order.orderStatus === 'DELIVERED' ? 'Delivered' : 'Out for Delivery'}
                              </span>
                              <span className="step-sub">
                                {order.orderStatus === 'DELIVERED' ? 'Arrived safely at your doorstep' : 'Arriving at your doorstep'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="order-card-divider"></div>

                  {/* Ordered Items List (Clickable to open Product Detail Modal!) */}
                  <div className="ordered-items-section-header">
                    <span>ORDERED KITS ({order.items?.length || 0}) — CLICK TO VIEW PRODUCT DETAILS</span>
                  </div>

                  <ul className="order-items-sublist">
                    {order.items?.map((item) => {
                      const matchedJersey =
                        jerseys.find((j) => j.id === item.jerseyId) ||
                        jerseys.find((j) => j.name === item.jerseyName);

                      return (
                        <li
                          key={item.id}
                          className="order-item-clickable-card"
                          onClick={() => {
                            if (matchedJersey && onOpenJerseyDetails) {
                              onOpenJerseyDetails(matchedJersey);
                              onClose();
                            }
                          }}
                          title="Click to view kit details"
                        >
                          {matchedJersey?.imageUrl ? (
                            <img
                              src={matchedJersey.imageUrl}
                              alt={item.jerseyName}
                              className="order-item-thumbnail"
                            />
                          ) : (
                            <div className="order-item-fallback-thumb">⚽</div>
                          )}

                          <div className="order-item-desc">
                            <div className="item-title-row">
                              <span className="item-title">{item.jerseyName}</span>
                              <span className="inspect-link">View Details ↗</span>
                            </div>

                            <span className="item-specs-sub">
                              Size: <strong>{item.size}</strong> • Quantity: <strong>{item.quantity}</strong>
                            </span>

                            {(item.customName || item.customNumber) && (
                              <span className="item-flocking">
                                ✨ Flocked: {item.customName} #{item.customNumber}
                                {item.fontFinish === 'gold-foil' ? ' • Gold Foil' : ''}
                                {item.sleevePatch && item.sleevePatch !== 'none'
                                  ? ` • ${item.sleevePatch.toUpperCase()} Patch`
                                  : ''}
                              </span>
                            )}
                          </div>

                          <div className="item-price-col">
                            <span className="item-line-price">₹{Number(item.lineTotal)}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="order-card-divider"></div>

                  {/* Address & Total Footer */}
                  <div className="order-receipt-footer">
                    <div className="order-delivery-address">
                      <span className="address-label">DELIVERING TO</span>
                      <p>
                        {order.shippingAddress}, {order.city} — <strong>{order.pincode}</strong>
                      </p>
                      <p className="phone-sub">Phone: {order.customerPhone}</p>
                    </div>

                    <div className="order-total-due">
                      <span className="total-label">ORDER TOTAL DUE</span>
                      <span className="total-val">₹{Number(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrdersModal;
