import { useState } from 'react';
import './Hero.css';

function Hero({ jerseys = [], onQuickAdd, onOpenDetails }) {
  const [heroSize, setHeroSize] = useState('L');
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // 1. Filter ONLY jerseys that are currently IN STOCK (inStock !== false)
  const inStockJerseys = jerseys.filter((j) => j.inStock !== false);

  // Fallback default if catalog has not loaded yet
  const defaultFallback = {
    id: 2,
    name: 'FC Barcelona 125th Anniversary Home Kit',
    team: 'FC Barcelona',
    price: 899,
    originalPrice: 1499,
    imageUrl: '/images/jerseys/barcelona-home.jpg',
    inStock: true
  };

  // Sort available in-stock kits: prioritize Real Madrid if in stock, followed by others
  const sortedInStock = [...inStockJerseys].sort((a, b) => {
    if (a.team === 'Real Madrid') return -1;
    if (b.team === 'Real Madrid') return 1;
    return 0;
  });

  // Display list contains ONLY in-stock products (or fallback if all are out of stock)
  const displayList = sortedInStock.length > 0 
    ? sortedInStock 
    : (jerseys.length > 0 ? jerseys : [defaultFallback]);

  // Ensure current index is valid
  const safeIndex = spotlightIndex >= displayList.length ? 0 : spotlightIndex;
  const heroJersey = displayList[safeIndex];
  const isOutOfStock = heroJersey.inStock === false;

  function handlePrev(e) {
    e.stopPropagation();
    setSpotlightIndex((prev) => (prev - 1 + displayList.length) % displayList.length);
  }

  function handleNext(e) {
    e.stopPropagation();
    setSpotlightIndex((prev) => (prev + 1) % displayList.length);
  }

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Column: Value Proposition & Actions */}
        <div className="hero-text-content">
          <div className="kicker-tag">
            <span className="kicker-icon">🏆</span>
            <span className="kicker-text">OFFICIAL 2024/25 SEASON DROP</span>
          </div>

          <h1 className="hero-title">
            WEAR THE ARMOR. <br />
            <span className="hero-title-accent">FEEL THE GLORY.</span>
          </h1>

          <p className="hero-subtitle">
            Premium master-copy club kits, legendary European retro treasures, and bespoke player customization with official tournament badges.
          </p>

          <div className="hero-cta-group">
            <a href="#catalog" className="cta-primary">
              Shop New Season →
            </a>
            <a href="#customizer" className="cta-secondary">
              Launch Customizer ⚙️
            </a>
          </div>

          {/* Trust Strip */}
          <div className="hero-trust-strip">
            <span className="trust-item">🛡️ 100% Embroidered Badges</span>
            <span className="trust-dot">•</span>
            <span className="trust-item">🚚 Pan-India Delivery</span>
            <span className="trust-dot">•</span>
            <span className="trust-item">⚡ Dispatched in 24h</span>
          </div>
        </div>

        {/* Right Column: Interactive Product Spotlight Card */}
        <div className="hero-visual-content">
          <div className="hero-spotlight-glow"></div>

          <div className="hero-card-wrapper">
            {/* Top Bar on Spotlight: Stock Status + In-Stock Carousel Controls */}
            <div className="hero-spotlight-topbar">
              <span className={`hero-stock-badge ${isOutOfStock ? 'out' : 'in'}`}>
                {isOutOfStock ? '🔴 All Kits Sold Out' : '🟢 In Stock'}
              </span>

              {displayList.length > 1 && (
                <div className="hero-carousel-nav">
                  <span className="hero-counter-label">
                    {safeIndex + 1} / {displayList.length}
                  </span>
                  <div className="hero-nav-btns">
                    <button
                      type="button"
                      className="hero-nav-btn"
                      onClick={handlePrev}
                      title="Previous in-stock kit"
                      aria-label="Previous kit"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="hero-nav-btn"
                      onClick={handleNext}
                      title="Next in-stock kit"
                      aria-label="Next kit"
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="hero-img-relative">
              <img
                src={heroJersey.imageUrl}
                alt={heroJersey.name}
                className={`hero-jersey-img ${isOutOfStock ? 'hero-sold-out-img' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => onOpenDetails && onOpenDetails(heroJersey)}
                title="Click to view kit details"
              />
            </div>

            {/* Floating Quick-Action Glass Card */}
            <div className="hero-glass-card">
              <div
                className="glass-card-header"
                style={{ cursor: 'pointer' }}
                onClick={() => onOpenDetails && onOpenDetails(heroJersey)}
                title="Click to view kit details"
              >
                <div>
                  <span className="glass-team">{heroJersey.team}</span>
                  <h4 className="glass-title">{heroJersey.name}</h4>
                </div>
                <div className="glass-price-box">
                  <span className="glass-price">₹{heroJersey.price}</span>
                  {heroJersey.originalPrice && (
                    <span className="glass-old-price">₹{heroJersey.originalPrice}</span>
                  )}
                </div>
              </div>

              {/* Interactive Size Chips */}
              <div className="glass-sizes">
                <span className="glass-size-label">Select Size:</span>
                <div className="glass-size-chips">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      disabled={isOutOfStock}
                      className={`glass-chip ${heroSize === size ? 'active' : ''} ${isOutOfStock ? 'disabled' : ''}`}
                      onClick={() => setHeroSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-actions-row">
                <button
                  type="button"
                  className={`glass-add-btn ${isOutOfStock ? 'sold-out' : ''}`}
                  disabled={isOutOfStock}
                  onClick={() => {
                    if (!isOutOfStock && onQuickAdd) {
                      onQuickAdd(heroJersey, heroSize);
                    }
                  }}
                  title={isOutOfStock ? 'Currently out of stock' : `Add ${heroSize} to Bag`}
                >
                  {isOutOfStock ? 'Sold Out — Join Waitlist' : `+ Add (${heroSize}) to Bag 🛒`}
                </button>
                <button
                  type="button"
                  className="glass-details-btn"
                  onClick={() => onOpenDetails && onOpenDetails(heroJersey)}
                >
                  Details 🔍
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
