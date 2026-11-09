import './Navbar.css';

function Navbar({ cartCount = 0 }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <div className="nav-logo">
          <span className="logo-icon">⚽</span>
          <span className="logo-text">Jersey<span className="highlight">4U</span></span>
        </div>

        {/* Navigation Categories */}
        <ul className="nav-links">
          <li><a href="#all" className="active">All Kits</a></li>
          <li><a href="#laliga">La Liga</a></li>
          <li><a href="#premierleague">Premier League</a></li>
          <li><a href="#retro">Retro Classics</a></li>
        </ul>

        {/* Dynamic Shopping Cart Button driven by Props & State! */}
        <div className="nav-actions">
          <button className="cart-btn">
            🛒 Cart <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
