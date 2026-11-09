import './CartDrawer.css';

function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  if (!isOpen) return null;

  // Calculate Subtotal in INR
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingThreshold = 999;
  const isFreeShipping = subtotal >= shippingThreshold || cartItems.length === 0;
  const shippingCost = isFreeShipping ? 0 : 99;
  const total = subtotal + shippingCost;
  const amountNeededForFreeShipping = Math.max(0, shippingThreshold - subtotal);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-box">
            <span className="drawer-icon">🛒</span>
            <div>
              <h3 className="drawer-title">YOUR MATCHDAY BAG</h3>
              <span className="drawer-count">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items Selected
              </span>
            </div>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {cartItems.length > 0 && (
          <div className="shipping-banner">
            {isFreeShipping ? (
              <p className="shipping-success">
                🎉 <strong>FREE PAN-INDIA DELIVERY UNLOCKED!</strong>
              </p>
            ) : (
              <p className="shipping-info">
                Add <strong>₹{amountNeededForFreeShipping}</strong> more to unlock{' '}
                <span className="gold-text">FREE Delivery</span>!
              </p>
            )}
            <div className="shipping-progress-bar">
              <div
                className="shipping-progress-fill"
                style={{
                  width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%`
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <span className="empty-icon">⚽</span>
              <h4>Your Matchday Bag is Empty</h4>
              <p>Looks like you haven't picked your armor yet. Browse the collection for official fan & player edition kits!</p>
              <button
                type="button"
                className="continue-shopping-btn"
                onClick={onClose}
              >
                Explore Vault Kits →
              </button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {cartItems.map((item) => (
                <li
                  key={`${item.id}-${item.size}`}
                  className="cart-item-card"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="cart-item-thumb"
                  />

                  <div className="cart-item-details">
                    <span className="cart-item-team">{item.team}</span>
                    <h5 className="cart-item-name">{item.name}</h5>

                    <div className="cart-item-meta">
                      <span className="cart-item-size-pill">
                        Size: <strong>{item.size}</strong>
                      </span>
                      <span className="cart-item-price">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="cart-item-actions">
                      <div className="qty-counter">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.size, -1)}
                          title="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.size, 1)}
                          title="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() => onRemoveItem(item.id, item.size)}
                        title="Remove kit"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drawer Footer with Calculations & Checkout */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Subtotal</span>
                <span className="summary-val">₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Pan-India Delivery</span>
                <span className="summary-val">
                  {isFreeShipping ? (
                    <span className="free-shipping-tag">FREE</span>
                  ) : (
                    `₹${shippingCost}`
                  )}
                </span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total Due</span>
                <span className="total-amount">₹{total}</span>
              </div>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={() => {
                alert(
                  `🎉 Ready to Checkout!\n\nOrder Total: ₹${total}\n\nIn Phase 8, this button triggers Razorpay (UPI, GPay, PhonePe, Cards, NetBanking)!`
                );
              }}
            >
              PROCEED TO SECURE CHECKOUT ⚡
            </button>

            <div className="drawer-guarantees">
              <span>🛡️ 100% Quality Guarantee</span>
              <span>🔒 UPI / Cards / COD</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
