import './JerseyCard.css';

function JerseyCard({
  jersey,
  onOpenDetails,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false
}) {
  const { id, name, team, league, season = '24/25', price, originalPrice, imageUrl, inStock } = jersey;

  // Calculate discount percentage
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  function handleHeartClick(e) {
    e.stopPropagation(); // Don't open modal when clicking heart
    if (onToggleWishlist) {
      onToggleWishlist(jersey, !isWishlisted);
    }
  }

  function handleQuickAdd(e) {
    e.stopPropagation(); // Don't open modal when clicking quick add
    if (onAddToCart) {
      onAddToCart(jersey, 'M'); // Default size M for 1-click quick add
    }
  }

  return (
    <article
      className={`vault-jersey-card ${inStock === false ? 'sold-out' : ''}`}
      onClick={() => onOpenDetails && onOpenDetails(jersey)}
      title={`Click to view details for ${name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onOpenDetails && onOpenDetails(jersey);
        }
      }}
    >
      {/* 1. Large Image Showcase with Badges */}
      <div className="card-media-wrapper">
        <img src={imageUrl} alt={name} className="card-jersey-image" />

        {/* Top-Left League & Season Badge */}
        <span className="card-league-pill">
          {league} • {season}
        </span>

        {/* Top-Right Wishlist Heart */}
        <button
          type="button"
          className={`card-wishlist-toggle ${isWishlisted ? 'liked' : ''}`}
          onClick={handleHeartClick}
          title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>

        {/* Custom Print Ready Ribbon */}
        <span className="card-custom-badge">
          ✨ Custom Print Ready
        </span>

        {/* Hover Overlay Hint */}
        <div className="card-hover-overlay">
          <span className="view-details-pill">
            🔍 View Kit Details & Specs
          </span>
        </div>
      </div>

      {/* 2. Content & Pricing */}
      <div className="card-meta-wrapper">
        <span className="card-team-label">{team}</span>
        <h3 className="card-product-name">{name}</h3>

        <div className="card-price-row">
          <div className="price-stack">
            <span className="card-price">${price}</span>
            {originalPrice && (
              <span className="card-old-price">${originalPrice}</span>
            )}
          </div>

          {discountPercentage && (
            <span className="card-discount-pill">SAVE {discountPercentage}%</span>
          )}
        </div>

        {/* 3. Action Row */}
        <div className="card-bottom-actions">
          {inStock !== false ? (
            <>
              <button
                type="button"
                className="card-quick-add-btn"
                onClick={handleQuickAdd}
                title="Quick add size M to bag"
              >
                + Quick Add (M) 🛒
              </button>
              <button
                type="button"
                className="card-explore-btn"
                onClick={() => onOpenDetails && onOpenDetails(jersey)}
              >
                Details →
              </button>
            </>
          ) : (
            <span className="card-sold-out-banner">Sold Out</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default JerseyCard;
