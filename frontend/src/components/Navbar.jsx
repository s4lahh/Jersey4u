import { useState, useRef, useEffect } from 'react';
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
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

            {/* User Auth / Orders Dropdown Menu */}
            {currentUser ? (
              <div className="user-dropdown-container" ref={dropdownRef}>
                <button
                  type="button"
                  className={`utility-btn user-menu-trigger ${isUserMenuOpen ? 'active' : ''}`}
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  title="My Account"
                  aria-expanded={isUserMenuOpen}
                >
                  <span className="user-initial-badge">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <span className="user-first-name">
                    {currentUser.name ? currentUser.name.split(' ')[0] : 'Fan'}
                  </span>
                  <span className="user-chevron">{isUserMenuOpen ? '▴' : '▾'}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown-panel">
                    <div className="dropdown-account-header">
                      <span className="dropdown-user-title">{currentUser.name || 'Football Fan'}</span>
                      <span className="dropdown-user-email">{currentUser.email}</span>
                    </div>
                    <div className="dropdown-sep"></div>
                    <button
                      type="button"
                      className="dropdown-action-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onOpenMyOrders) onOpenMyOrders();
                      }}
                    >
                      <span className="dropdown-action-icon">📦</span>
                      <span>My Orders &amp; Tracking</span>
                    </button>
                    <div className="dropdown-sep"></div>
                    <button
                      type="button"
                      className="dropdown-action-btn signout-action"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onLogout) onLogout();
                      }}
                    >
                      <span className="dropdown-action-icon">🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="utility-btn signin-btn"
                onClick={onOpenAuth}
                title="Sign In or Register"
              >
                <span className="signin-icon">👤</span>
                <span className="signin-text">Sign In</span>
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
