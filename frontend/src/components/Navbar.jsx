import './Navbar.css';

function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  selectedLeague = 'all',
  onSelectLeague,
  searchQuery = '',
  onSearchChange,
  onOpenCart,
  onOpenWishlist,
  currentUser = null,
  onOpenAuth,
  onOpenMyOrders,
  onLogout
}) {
  const navCategories = [
    { id: 'all', label: 'All Kits' },
    { id: 'Premier League', label: 'Premier League' },
    { id: 'La Liga', label: 'La Liga' },
    { id: 'Serie A', label: 'Serie A' },
    { id: 'International', label: 'International' },
    { id: 'Retro', label: 'Retro Classics' }
  ];

  function handleCategoryClick(e, categoryId) {
    e.preventDefault();
    if (onSelectLeague) {
      onSelectLeague(categoryId);
    }
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <header className="header-wrapper">
      {/* 1. Top Announcement Strip (Pan-India Offer Bar) */}
      <div className="announcement-bar">
        <p>⚡ FREE PAN-INDIA DELIVERY ON ORDERS ABOVE ₹999 • 100% EMBROIDERED BADGES • COD & UPI AVAILABLE</p>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          {/* Brand Logo */}
          <div
            className="nav-logo"
            onClick={() => onSelectLeague && onSelectLeague('all')}
            title="Jersey4U Home"
          >
            <span className="logo-icon">⚽</span>
            <div className="logo-brand">
              <span className="brand-name">JERSEY4U</span>
              <span className="vault-pill">THE VAULT</span>
            </div>
          </div>

          {/* Navigation Category Links */}
          <ul className="nav-links">
            {navCategories.map((cat) => (
              <li key={cat.id}>
                <a
                  href={`#${cat.id}`}
                  className={selectedLeague.toLowerCase() === cat.id.toLowerCase() ? 'active' : ''}
                  onClick={(e) => handleCategoryClick(e, cat.id)}
                >
                  {cat.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#customizer"
                className="customizer-link"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('customizer');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Customizer ⚙️
              </a>
            </li>
          </ul>

          {/* Right Utility Bar: Search, Wishlist, Cart */}
          <div className="nav-utilities">
            {/* Controlled Search Input */}
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search club, league, kit..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => {
                  if (onSearchChange) {
                    onSearchChange(e.target.value);
                  }
                  const catalogEl = document.getElementById('catalog');
                  if (catalogEl && e.target.value.trim().length === 1) {
                    catalogEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => onSearchChange && onSearchChange('')}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* User Auth / Orders Button */}
            {currentUser ? (
              <div className="user-nav-group">
                <button
                  type="button"
                  className="utility-btn user-btn"
                  onClick={onOpenMyOrders}
                  title="View My Orders"
                >
                  👤 <span className="user-name">{currentUser.name ? currentUser.name.split(' ')[0] : 'Fan'}</span>
                </button>
                <button
                  type="button"
                  className="utility-btn logout-btn"
                  onClick={onLogout}
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  🚪
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="utility-btn signin-btn"
                onClick={onOpenAuth}
                title="Sign In or Register"
              >
                👤 <span className="signin-text">Sign In</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              type="button"
              className="utility-btn wishlist-icon-btn"
              onClick={onOpenWishlist}
              title="View Saved Wishlist"
              aria-label="View Saved Wishlist"
            >
              ❤️ <span className="util-badge wishlist-badge">{wishlistCount}</span>
            </button>

            {/* Cart Button */}
            <button
              type="button"
              className="utility-btn cart-btn"
              onClick={onOpenCart}
              title="View Matchday Bag"
              aria-label="View Matchday Bag"
            >
              🛒 <span className="cart-text">Bag</span> <span className="util-badge cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
