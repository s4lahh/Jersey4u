import { useState } from 'react';
import './JerseyCard.css';

function JerseyCard({ jersey, onAddToCart, onToggleWishlist, isWishlisted = false }) {
  const { id, name, team, league, season = '24/25', price, originalPrice, imageUrl, inStock } = jersey;

  // 1. STATE: Which size is selected? (Default is 'M')
  const [selectedSize, setSelectedSize] = useState('M');

  // 2. STATE: Wishlist status
  const [liked, setLiked] = useState(isWishlisted);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Calculate discount percentage if originalPrice exists
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  function handleHeartClick() {
    const nextState = !liked;
    setLiked(nextState);
    if (onToggleWishlist) {
      onToggleWishlist(jersey, nextState);
    }
  }

  return (
    <div className="jersey-card">
      {/* 1. Image Container with Badges */}
      <div className="jersey-image-container">
        <img src={imageUrl} alt={name} className="jersey-img" />

        {/* Top-Left League & Season Tag */}
        <span className="league-tag">
          {league} • {season}
        </span>

        {/* Top-Right Floating Wishlist Heart */}
        <button
          type="button"
          className="wishlist-btn"
          onClick={handleHeartClick}
          title={liked ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          {liked ? '❤️' : '🤍'}
        </button>

        {/* Bottom-Left Customizer Ready Tag */}
        <span className="custom-ready-badge">
          ✨ Custom Print Ready
        </span>
      </div>

      {/* 2. Product Information */}
      <div className="jersey-content">
        <span className="team-label">{team}</span>
        <h3 className="jersey-name" title={name}>{name}</h3>

        {/* Price Row with Discount Tag */}
        <div className="price-row">
          <span className="current-price">${price}</span>
          {originalPrice && (
            <span className="original-price">${originalPrice}</span>
          )}
          {discountPercentage && (
            <span className="discount-tag">SAVE {discountPercentage}%</span>
          )}
        </div>

        {/* Interactive Size Chips */}
        <div className="size-selector">
          <span className="size-label">Select Size:</span>
          <div className="size-chips">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={`size-chip ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Dual Action Buttons (Add to Bag + Customize) */}
        {inStock ? (
          <div className="card-actions-row">
            <button
              type="button"
              className="card-btn-primary"
              onClick={() => onAddToCart && onAddToCart(jersey, selectedSize)}
            >
              Add to Bag ({selectedSize}) 🛒
            </button>
            <a href="#customizer" className="card-btn-customize" title="Personalize Name & Number">
              Customize ⚡
            </a>
          </div>
        ) : (
          <button type="button" className="card-btn-disabled" disabled>
            Sold Out — Notify Me 🔔
          </button>
        )}
      </div>
    </div>
  );
}

export default JerseyCard;
