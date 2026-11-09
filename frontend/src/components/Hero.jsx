import { useState } from 'react';
import './Hero.css';

function Hero({ onQuickAdd }) {
  const [heroSize, setHeroSize] = useState('L');
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const heroJersey = {
    name: 'Real Madrid 2024/25 Authentic Home',
    team: 'Real Madrid',
    price: 89.99,
    originalPrice: 109.99,
    imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80',
    inStock: true
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Column: Value Proposition & Actions */}
        <div className="hero-text-content">
          <div className="kicker-tag">
            <span className="kicker-icon">🏆</span>
            <span className="kicker-text">OFFICIAL DROP // 2024/25 SEASON</span>
          </div>

          <h1 className="hero-title">
            WEAR THE ARMOR. <br />
            <span className="hero-title-accent">FEEL THE GLORY.</span>
          </h1>

          <p className="hero-subtitle">
            Official authentic club kits, legendary European retro treasures, and bespoke player customization with authentic league badges.
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
            <span className="trust-item">🛡️ 100% Authentic Kits</span>
            <span className="trust-dot">•</span>
            <span className="trust-item">🏆 Official League Badges</span>
            <span className="trust-dot">•</span>
            <span className="trust-item">⚡ Fast Global Dispatch</span>
          </div>
        </div>

        {/* Right Column: Interactive Product Spotlight Card */}
        <div className="hero-visual-content">
          <div className="hero-spotlight-glow"></div>

          <div className="hero-card-wrapper">
            <img
              src={heroJersey.imageUrl}
              alt={heroJersey.name}
              className="hero-jersey-img"
            />

            {/* Floating Quick-Action Glass Card */}
            <div className="hero-glass-card">
              <div className="glass-card-header">
                <div>
                  <span className="glass-team">{heroJersey.team}</span>
                  <h4 className="glass-title">{heroJersey.name}</h4>
                </div>
                <div className="glass-price-box">
                  <span className="glass-price">${heroJersey.price}</span>
                  <span className="glass-old-price">${heroJersey.originalPrice}</span>
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
                      className={`glass-chip ${heroSize === size ? 'active' : ''}`}
                      onClick={() => setHeroSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="glass-add-btn"
                onClick={() => onQuickAdd && onQuickAdd(heroJersey, heroSize)}
              >
                + Quick Add ({heroSize}) to Bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
