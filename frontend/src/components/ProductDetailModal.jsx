import { useState, useEffect } from 'react';
import './ProductDetailModal.css';

function ProductDetailModal({
  jersey,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false
}) {
  if (!jersey) return null;

  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'specs' | 'delivery'

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Calculate discount percentage
  const discountPercentage = jersey.originalPrice
    ? Math.round(((jersey.originalPrice - jersey.price) / jersey.originalPrice) * 100)
    : null;

  // Close on ESC key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const features = jersey.features || [
    'Official Authentic matchday edition with authentic club crest',
    'HEAT.RDY breathable moisture-wicking athletic mesh fabric',
    'Official tournament / league sleeve badge included',
    'Tailored athletic performance fit (identical to player match kit)',
    '100% Recycled polyester doubleknit engineered fabric'
  ];

  const description =
    jersey.description ||
    `Experience the passion of matchday with the official ${jersey.name}. Crafted to meet elite performance standards, this kit combines breathable cooling fabric with precision heat-applied crests for the ultimate fan and player experience.`;

  return (
    <div className="product-modal-backdrop" onClick={onClose}>
      <div
        className="product-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close product view"
        >
          ✕
        </button>

        <div className="modal-content-grid">
          {/* Left Column: Product Visual Showcase */}
          <div className="modal-gallery">
            <div className="modal-main-image-box">
              <img
                src={jersey.imageUrl}
                alt={jersey.name}
                className="modal-main-image"
              />

              <span className="modal-badge-league">
                {jersey.league} • {jersey.season || '24/25'}
              </span>

              <button
                type="button"
                className="modal-wishlist-toggle"
                onClick={() => onToggleWishlist && onToggleWishlist(jersey, !isWishlisted)}
                title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
              >
                {isWishlisted ? '❤️ Saved' : '🤍 Save'}
              </button>
            </div>

            <div className="modal-trust-pills">
              <span>🛡️ 100% Quality Guaranteed</span>
              <span>⚡ Ships in 24h</span>
              <span>🔄 7-Day Exchange</span>
            </div>
          </div>

          {/* Right Column: Information, Specs, Size & Purchase */}
          <div className="modal-info-pane">
            <span className="modal-team-kicker">{jersey.team}</span>
            <h2 className="modal-product-title">{jersey.name}</h2>

            {/* Rating */}
            <div className="modal-rating-row">
              <span className="stars">★★★★★</span>
              <span className="rating-text">4.9 / 5.0 (140+ Fan Reviews)</span>
            </div>

            {/* Price Box */}
            <div className="modal-price-box">
              <span className="modal-current-price">₹{jersey.price}</span>
              {jersey.originalPrice && (
                <span className="modal-orig-price">₹{jersey.originalPrice}</span>
              )}
              {discountPercentage && (
                <span className="modal-discount-tag">SAVE {discountPercentage}%</span>
              )}
              <span className="modal-stock-status">
                {jersey.inStock !== false ? '🟢 In Stock (Ready to Dispatch)' : '🔴 Currently Sold Out'}
              </span>
            </div>

            {/* Interactive Tabs */}
            <div className="modal-tabs-header">
              <button
                type="button"
                className={`modal-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Description
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Tech Specs
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
                onClick={() => setActiveTab('delivery')}
              >
                Pan-India Delivery
              </button>
            </div>

            <div className="modal-tab-content">
              {activeTab === 'details' && (
                <p className="modal-description-text">{description}</p>
              )}

              {activeTab === 'specs' && (
                <ul className="modal-specs-list">
                  {features.map((feat, idx) => (
                    <li key={idx}>✓ {feat}</li>
                  ))}
                </ul>
              )}

              {activeTab === 'delivery' && (
                <div className="modal-delivery-info">
                  <p>🚚 <strong>Pan-India Express:</strong> Dispatched in 24 hours. Free delivery on orders above ₹999.</p>
                  <p>💳 <strong>Payment Options:</strong> UPI (GPay/PhonePe), Credit/Debit Cards, NetBanking & COD.</p>
                  <p>🔄 <strong>Easy Exchange:</strong> 7-day hassle-free size exchange policy.</p>
                </div>
              )}
            </div>

            {/* Size Selector */}
            <div className="modal-size-section">
              <div className="modal-size-header">
                <span className="size-section-label">Select Size:</span>
                <span className="size-guide-hint">📏 True to Fit (Standard Indian/Euro sizing)</span>
              </div>
              <div className="modal-size-chips">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`modal-size-chip ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="modal-quantity-row">
              <span className="qty-label">Quantity:</span>
              <div className="modal-qty-control">
                <button
                  type="button"
                  className="modal-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="modal-qty-value">{quantity}</span>
                <button
                  type="button"
                  className="modal-qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="modal-actions-group">
              <button
                type="button"
                className="modal-add-bag-btn"
                disabled={jersey.inStock === false}
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    onAddToCart(jersey, selectedSize);
                  }
                  onClose();
                }}
              >
                {jersey.inStock !== false
                  ? `Add to Bag (${selectedSize} • ${quantity}) 🛒`
                  : 'Sold Out — Join Waitlist'}
              </button>

              <a
                href="#customizer"
                className="modal-customize-btn"
                onClick={onClose}
              >
                Customize with Player Name & Number (+₹150) ⚡
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
