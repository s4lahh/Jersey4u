import './JerseyCard.css';

function JerseyCard({ jersey }) {
  // Destructure the properties from the jersey object
  const { name, team, league, price, originalPrice, imageUrl, inStock } = jersey;

  return (
    <div className="jersey-card">
      {/* 1. Image & League Tag */}
      <div className="jersey-image-container">
        <img src={imageUrl} alt={name} className="jersey-img" />
        <span className="league-tag">{league}</span>
      </div>

      {/* 2. Product Details */}
      <div className="jersey-content">
        <span className="team-label">{team}</span>
        <h3 className="jersey-name">{name}</h3>

        {/* 3. Pricing Row */}
        <div className="price-row">
          <span className="current-price">${price}</span>
          {originalPrice && (
            <span className="original-price">${originalPrice}</span>
          )}
        </div>

        {/* 4. Action Button with Boolean Condition */}
        <button className="card-btn" disabled={!inStock}>
          {inStock ? 'Add to Cart 🛒' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}

export default JerseyCard;
