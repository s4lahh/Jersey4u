import { useState } from 'react';
import './Hero.css';

function Hero({ jerseys = [], onQuickAdd, onOpenDetails }) {
  const [heroSize, setHeroSize] = useState('L');
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const defaultHero = {
    id: 1,
    name: 'Real Madrid 2024/25 Authentic Home Kit',
    team: 'Real Madrid',
    price: 899,
    originalPrice: 1499,
    imageUrl: '/images/jerseys/real-madrid-home.jpg',
    inStock: true
  };

  // Dynamically resolve Real Madrid kit from live backend state
  const heroJersey = jerseys.find((j) => j.team === 'Real Madrid' || j.id === 1) || defaultHero;
  const isOutOfStock = heroJersey.inStock === false;

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
            <div className="hero-img-relative">
              <img
                src={heroJersey.imageUrl}
                alt={heroJersey.name}
                className={`hero-jersey-img ${isOutOfStock ? 'hero-sold-out-img' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => onOpenDetails && onOpenDetails(heroJersey)}
                title="Click to view kit details"
              />
              {isOutOfStock && (
                <span className="hero-sold-out-badge">
                  SOLD OUT
                </span>
              )}
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
                  <div className="glass-team-row">
                    <span className="glass-team">{heroJersey.team}</span>
                    {isOutOfStock && (
                      <span className="hero-stock-pill-out">🔴 Sold Out</span>
                    )}
                  </div>
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
