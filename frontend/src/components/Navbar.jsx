import './Navbar.css';

function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  selectedLeague = 'all',
  onSelectLeague,
  onOpenCart,
  onOpenWishlist
}) {
  const navCategories = [
    { id: 'all', label: 'All Kits' },
    { id: 'Premier League', label: 'Premier League' },
    { id: 'La Liga', label: 'La Liga' },
    { id: 'Serie A', label: 'Serie A' },
    { id: 'International', label: 'International' },
    { id: 'Retro', label: 'Retro Vault' }
  ];

  function handleCategoryClick(e, categoryId) {
    e.preventDefault();
    if (onSelectLeague) {
      onSelectLeague(categoryId);
    }
    // Smooth scroll to catalog
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

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

          {/* Navigation Category Links (Synchronized with Catalog Filter!) */}
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
              <a href="#customizer" className="customizer-link">
                Customizer ⚙️
              </a>
            </li>
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
