import { useState } from 'react';
import './CheckoutModal.css';

function CheckoutModal({
  isOpen,
  onClose,
  cartItems = [],
  onOrderSuccess
}) {
  // Controlled Shipping & Payment Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'COD'
  const [upiId, setUpiId] = useState('fan@okaxis');

  // Submission & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isOpen) return null;

  // Derived Summary Totals (mirrors Spring Boot server calculation)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 999 || cartItems.length === 0 ? 0 : 99;
  const total = subtotal + shippingFee;

  function handleCloseAndReset() {
    setSubmitError('');
    if (confirmedOrder) {
      setConfirmedOrder(null);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setShippingAddress('');
      setCity('');
      setPincode('');
    }
    onClose();
  }

  async function handleSubmitOrder(e) {
    e.preventDefault();
    setSubmitError('');

    // Basic client-side guards before hitting Spring Boot
    if (!customerName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!/^\d{10}$/.test(customerPhone.trim())) {
      setSubmitError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!shippingAddress.trim() || !city.trim()) {
      setSubmitError('Please enter your complete street address and city.');
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setSubmitError('Please enter a valid 6-digit PIN code (e.g., 400001).');
      return;
    }
    if (paymentMethod === 'UPI' && !upiId.includes('@')) {
      setSubmitError('Please enter a valid UPI ID (e.g., name@okaxis or name@ybl).');
      return;
    }

    const payload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      shippingAddress: shippingAddress.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      paymentMethod,
      items: cartItems.map((item) => ({
        jerseyId: item.id,
        size: item.size,
        quantity: item.quantity,
        customName: item.customName || '',
        customNumber: item.customNumber || '',
        fontFinish: item.fontFinish || 'standard',
        sleevePatch: item.sleevePatch || 'none'
      }))
    };

    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:8081/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Order rejected with status ${response.status}`);
      }

      setConfirmedOrder(data);
      if (onOrderSuccess) {
        onOrderSuccess(data);
      }
    } catch (err) {
      setSubmitError(
        err.message || 'Could not reach Spring Boot backend on port 8081. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="checkout-overlay" onClick={handleCloseAndReset}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="checkout-close-btn"
          onClick={handleCloseAndReset}
          aria-label="Close checkout"
        >
          ✕
        </button>

        {confirmedOrder ? (
          /* ORDER CONFIRMED RECEIPT VIEW */
          <div className="order-success-view">
            <div className="success-check-circle">✓</div>
            <span className="success-kicker">SAVED TO MYSQL VAULT</span>
            <h2 className="success-title">Order Confirmed!</h2>
            <p className="success-subtitle">
              Thank you, <strong>{confirmedOrder.customerName}</strong>! Your official matchday kits
              are being prepared for dispatch.
            </p>

            <div className="receipt-card">
              <div className="receipt-top-row">
                <div>
                  <span className="receipt-label">ORDER REFERENCE</span>
                  <div className="receipt-code">{confirmedOrder.orderCode}</div>
                </div>
                <div className="receipt-status-group">
                  <span className="receipt-badge verified">{confirmedOrder.orderStatus}</span>
                  <span className="receipt-badge payment">
                    {confirmedOrder.paymentMethod} • {confirmedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-address-box">
                <span className="receipt-label">DELIVERING TO</span>
                <p>
                  {confirmedOrder.shippingAddress}, {confirmedOrder.city} —{' '}
                  <strong>{confirmedOrder.pincode}</strong>
                </p>
                <p>Mobile: {confirmedOrder.customerPhone}</p>
              </div>

              <div className="receipt-divider"></div>

              <ul className="receipt-items-list">
                {confirmedOrder.items?.map((item) => (
                  <li key={item.id} className="receipt-item-row">
                    <div>
                      <span className="receipt-item-name">
                        {item.jerseyName} (Size {item.size}) × {item.quantity}
                      </span>
                      {(item.customName || item.customNumber) && (
                        <span className="receipt-item-custom">
                          Custom Print: {item.customName} #{item.customNumber}
                          {item.fontFinish === 'gold-foil' ? ' • Gold Foil' : ''}
                          {item.sleevePatch && item.sleevePatch !== 'none'
                            ? ` • ${item.sleevePatch.toUpperCase()} Patch`
                            : ''}
                        </span>
                      )}
                    </div>
                    <span className="receipt-item-price">₹{Number(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>

              <div className="receipt-divider"></div>

              <div className="receipt-totals">
                <div className="receipt-total-row">
                  <span>Server-Verified Subtotal</span>
                  <span>₹{Number(confirmedOrder.subtotalAmount)}</span>
                </div>
                <div className="receipt-total-row">
                  <span>Pan-India Shipping</span>
                  <span>
                    {Number(confirmedOrder.shippingFee) === 0
                      ? 'FREE'
                      : `₹${Number(confirmedOrder.shippingFee)}`}
                  </span>
                </div>
                <div className="receipt-total-row grand">
                  <span>Total Amount</span>
                  <span>₹{Number(confirmedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="continue-vault-btn"
              onClick={handleCloseAndReset}
            >
              CONTINUE EXPLORING VAULT →
            </button>
          </div>
        ) : (
          /* CHECKOUT FORM + LIVE SUMMARY */
          <div className="checkout-layout">
            <div className="checkout-form-column">
              <div className="checkout-header">
                <span className="checkout-kicker">SECURE INDIA CHECKOUT</span>
                <h2 className="checkout-title">Shipping &amp; Payment</h2>
              </div>

              {submitError && (
                <div className="checkout-error-banner">
                  ⚠️ {submitError}
                </div>
              )}

              <form id="checkout-form" onSubmit={handleSubmitOrder} className="checkout-form">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="chk-name">Full Name *</label>
                    <input
                      id="chk-name"
                      type="text"
                      placeholder="e.g., Rayan Verma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="chk-phone">Mobile Number *</label>
                    <input
                      id="chk-phone"
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit WhatsApp / SMS no."
                      value={customerPhone}
                      onChange={(e) =>
                        setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="chk-email">Email Address (Optional)</label>
                  <input
                    id="chk-email"
                    type="email"
                    placeholder="for order confirmation receipt"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="chk-address">Delivery Street Address *</label>
                  <input
                    id="chk-address"
                    type="text"
                    placeholder="Flat / House No., Building, Area, Landmark"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="chk-city">City *</label>
                    <input
                      id="chk-city"
                      type="text"
                      placeholder="e.g., Pune / Mumbai / Bengaluru"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="chk-pincode">PIN Code *</label>
                    <input
                      id="chk-pincode"
                      type="text"
                      maxLength={6}
                      placeholder="6-digit PIN"
                      value={pincode}
                      onChange={(e) =>
                        setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="payment-section">
                  <label className="payment-heading">Select Payment Method</label>
                  <div className="payment-methods-grid">
                    <button
                      type="button"
                      className={`payment-option-card ${paymentMethod === 'UPI' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('UPI')}
                    >
                      <span className="pay-icon">📱</span>
                      <span className="pay-title">UPI / Instant</span>
                      <span className="pay-sub">GPay • PhonePe</span>
                    </button>

                    <button
                      type="button"
                      className={`payment-option-card ${paymentMethod === 'CARD' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('CARD')}
                    >
                      <span className="pay-icon">💳</span>
                      <span className="pay-title">Card</span>
                      <span className="pay-sub">Visa • RuPay</span>
                    </button>

                    <button
                      type="button"
                      className={`payment-option-card ${paymentMethod === 'COD' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('COD')}
                    >
                      <span className="pay-icon">📦</span>
                      <span className="pay-title">Cash on Delivery</span>
                      <span className="pay-sub">Pay at doorstep</span>
                    </button>
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="upi-box">
                      <label htmlFor="chk-upi">Enter UPI ID (Simulated Razorpay UPI Flow)</label>
                      <input
                        id="chk-upi"
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okaxis"
                      />
                    </div>
                  )}

                  {paymentMethod === 'CARD' && (
                    <div className="upi-box">
                      <span className="sim-note">
                        🔒 Simulated Razorpay Test Card Mode — No real money is charged.
                      </span>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Right Summary Column */}
            <div className="checkout-summary-column">
              <h3 className="summary-title">Your Matchday Bag ({cartItems.length})</h3>

              <ul className="checkout-items-list">
                {cartItems.map((item) => {
                  const key = item.lineKey || `${item.id}-${item.size}`;
                  return (
                    <li key={key} className="checkout-item-row">
                      <img src={item.imageUrl} alt={item.name} className="checkout-item-img" />
                      <div className="checkout-item-info">
                        <span className="checkout-item-name">{item.name}</span>
                        <span className="checkout-item-meta">
                          Size {item.size} • Qty {item.quantity}
                        </span>
                        {(item.customName || item.customNumber) && (
                          <span className="checkout-item-custom">
                            ✨ {item.customName} #{item.customNumber}
                          </span>
                        )}
                      </div>
                      <span className="checkout-item-price">₹{item.price * item.quantity}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="checkout-totals-box">
                <div className="checkout-total-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Pan-India Shipping</span>
                  <span className={shippingFee === 0 ? 'free-text' : ''}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="checkout-divider"></div>
                <div className="checkout-total-row final">
                  <span>Total Payable</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="place-order-btn"
                disabled={isSubmitting || cartItems.length === 0}
              >
                {isSubmitting
                  ? 'VERIFYING & SAVING ORDER...'
                  : paymentMethod === 'COD'
                  ? `CONFIRM COD ORDER • ₹${total}`
                  : `PAY ₹${total} & PLACE ORDER ⚡`}
              </button>

              <p className="checkout-security-note">
                🛡️ Spring Boot recalculates verified database prices in MySQL on submission.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
