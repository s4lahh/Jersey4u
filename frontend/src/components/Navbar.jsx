import './Navbar.css';

function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist
}) {
  return (
    <header className="header-wrapper">
      {/* 1. Top Announcement Strip */}
      <div className="announcement-bar">
        <p>⚡ 100% AUTHENTIC CLUB MERCHANDISE • OFFICIAL BADGES & FLOCKING • DISPATCH IN 24H</p>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          {/* Brand Logo with Gold Vault Pill */}
          <div className="nav-logo">
            <span className="logo-icon">⚽</span>
            <div className="logo-brand">
              <span className="brand-name">JERSEY4U</span>
              <span className="vault-pill">THE VAULT</span>
            </div>
          </div>

          {/* Navigation Category Links */}
          <ul className="nav-links">
            <li><a href="#all" className="active">All Kits</a></li>
            <li><a href="#new">New Season 24/25</a></li>
            <li><a href="#premierleague">Premier League</a></li>
            <li><a href="#laliga">La Liga</a></li>
            <li><a href="#seriea">Serie A</a></li>
            <li><a href="#retro">Retro Vault</a></li>
            <li><a href="#customizer" className="customizer-link">Customizer ⚙️</a></li>
          </ul>

          {/* Right Utility Bar: Search, Wishlist, Cart */}
          <div className="nav-utilities">
            {/* Search Input */}
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search kits, clubs, players..."
                className="search-input"
              />
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              className="utility-btn wishlist-icon-btn"
              onClick={onOpenWishlist}
              title="View Saved Wishlist"
              aria-label="View Saved Wishlist"
            >
              ❤️ <span className="util-badge">{wishlistCount}</span>
            </button>

            {/* Cart Button */}
            <button
              type="button"
              className="utility-btn cart-btn"
              onClick={onOpenCart}
              title="View Matchday Bag"
              aria-label="View Matchday Bag"
            >
              🛒 Bag <span className="util-badge cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
