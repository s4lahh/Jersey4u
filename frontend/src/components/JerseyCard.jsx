import { useState } from 'react';
import './JerseyCard.css';

function JerseyCard({ jersey, onAddToCart }) {
  const { name, team, league, price, originalPrice, imageUrl, inStock } = jersey;

  // 1. STATE: Which size is selected? (Default is 'M')
  const [selectedSize, setSelectedSize] = useState('M');

  // 2. STATE: Is this jersey saved in Wishlist? (Default is false)
  const [isLiked, setIsLiked] = useState(false);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="jersey-card">
      <div className="jersey-image-container">
        <img src={imageUrl} alt={name} className="jersey-img" />
        <span className="league-tag">{league}</span>

        {/* Wishlist Heart Toggle */}
        <button
          className="wishlist-btn"
          onClick={() => setIsLiked(!isLiked)}
          title="Save to Wishlist"
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="jersey-content">
        <span className="team-label">{team}</span>
        <h3 className="jersey-name">{name}</h3>

        <div className="price-row">
          <span className="current-price">${price}</span>
          {originalPrice && (
            <span className="original-price">${originalPrice}</span>
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

        {/* Add to Cart Button */}
        <button
          className="card-btn"
          disabled={!inStock}
          onClick={() => onAddToCart && onAddToCart(jersey, selectedSize)}
        >
          {inStock ? `Add to Cart (${selectedSize}) 🛒` : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}

export default JerseyCard;
