import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DiscoveryBar from './components/DiscoveryBar';
import JerseyCard from './components/JerseyCard';
import './App.css';

function App() {
  // 1. STATE: Cart Item Count
  const [cartCount, setCartCount] = useState(0);

  // 2. STATE: Wishlist Count
  const [wishlistCount, setWishlistCount] = useState(0);

  // 3. STATE: Selected League Filter (defaults to 'all')
  const [selectedLeague, setSelectedLeague] = useState('all');

  // Master Catalog of Football Kits
  const allJerseys = [
    {
      id: 1,
      name: 'Real Madrid 2024/25 Authentic Home Kit',
      team: 'Real Madrid',
      league: 'La Liga',
      season: '24/25',
      price: 89.99,
      originalPrice: 109.99,
      imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=600&q=80',
      inStock: true
    },
    {
      id: 2,
      name: 'FC Barcelona 125th Anniversary Home Kit',
      team: 'FC Barcelona',
      league: 'La Liga',
      season: '24/25',
      price: 89.99,
      originalPrice: 109.99,
      imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80',
      inStock: true
    },
    {
      id: 3,
      name: 'Manchester City 2024/25 Authentic Home Kit',
      team: 'Manchester City',
      league: 'Premier League',
      season: '24/25',
      price: 84.99,
      originalPrice: 99.99,
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
      inStock: true
    },
    {
      id: 4,
      name: 'Arsenal 2024/25 Cannon Crest Home Kit',
      team: 'Arsenal',
      league: 'Premier League',
      season: '24/25',
      price: 84.99,
      originalPrice: 99.99,
      imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80',
      inStock: false // Out of stock to demonstrate disabled state
    },
    {
      id: 5,
      name: 'Argentina 2024 World Champions Copa Edition',
      team: 'Argentina',
      league: 'International',
      season: '2024',
      price: 94.99,
      originalPrice: 119.99,
      imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=600&q=80',
      inStock: true
    },
    {
      id: 6,
      name: 'AC Milan 2006/07 Athens Champions League Retro',
      team: 'AC Milan',
      league: 'Retro',
      season: '06/07',
      price: 79.99,
      originalPrice: 95.00,
      imageUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=600&q=80',
      inStock: true
    }
  ];

  // Filtering jerseys by selected league or club
  const filteredJerseys = allJerseys.filter((jersey) => {
    if (selectedLeague === 'all') return true;
    return (
      jersey.league.toLowerCase() === selectedLeague.toLowerCase() ||
      jersey.team.toLowerCase().includes(selectedLeague.toLowerCase())
    );
  });

  // Handler: Add to Cart
  function handleAddToCart(jersey, size) {
    setCartCount((prev) => prev + 1);
  }

  // Handler: Toggle Wishlist
  function handleToggleWishlist(jersey, isNowLiked) {
    setWishlistCount((prev) => (isNowLiked ? prev + 1 : Math.max(0, prev - 1)));
  }

  return (
    <div className="app-layout">
      {/* 1. Agreed Top Announcement & Header */}
      <Navbar cartCount={cartCount} wishlistCount={wishlistCount} />

      {/* 2. Agreed Hero Section */}
      <Hero onQuickAdd={handleAddToCart} />

      {/* 3. Agreed 2-Tier League & Club Discovery Bar */}
      <DiscoveryBar
        selectedLeague={selectedLeague}
        onSelectLeague={setSelectedLeague}
        totalCount={filteredJerseys.length}
      />

      {/* 4. Agreed Product Catalog Grid */}
      <main className="catalog-wrapper" id="catalog">
        <div className="catalog-container">
          <div className="catalog-header">
            <div>
              <span className="section-kicker">CURATED COLLECTION</span>
              <h2 className="section-title">
                {selectedLeague === 'all' ? 'All Vault Kits' : `${selectedLeague} Collection`}
              </h2>
            </div>
            <span className="results-badge">{filteredJerseys.length} Kits Available</span>
          </div>

          <div className="jersey-grid">
            {filteredJerseys.map((jersey) => (
              <JerseyCard
                key={jersey.id}
                jersey={jersey}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        </div>
      </main>

      {/* 5. Minimal Vault Footer */}
      <footer className="vault-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-logo">⚽ JERSEY4U</span>
            <span className="footer-tagline">THE FOOTBALL VAULT • 100% AUTHENTIC MERCHANDISE</span>
          </div>
          <p className="footer-copy">© 2026 Jersey4U. Built with Spring Boot 3, MySQL 8 & React.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
