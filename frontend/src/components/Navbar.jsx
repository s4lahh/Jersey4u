import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* 1. Brand Logo */}
        <div className="nav-logo">
          <span className="logo-icon">⚽</span>
          <span className="logo-text">Jersey<span className="highlight">4U</span></span>
        </div>

        {/* 2. Navigation Categories */}
        <ul className="nav-links">
          <li><a href="#all" className="active">All Kits</a></li>
          <li><a href="#laliga">La Liga</a></li>
          <li><a href="#premierleague">Premier League</a></li>
          <li><a href="#retro">Retro Classics</a></li>
        </ul>

        {/* 3. Cart Button with Counter Badge */}
        <div className="nav-actions">
          <button className="cart-btn">
            🛒 Cart <span className="cart-badge">0</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
