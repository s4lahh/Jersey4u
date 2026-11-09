import { useState } from 'react';
import Navbar from './components/Navbar';
import JerseyCard from './components/JerseyCard';
import './App.css';

function App() {
  // 1. STATE: How many items are in the shopping cart?
  const [cartCount, setCartCount] = useState(0);

  // 2. STATE HANDLER: Function to increment cart count when a jersey is added
  function handleAddToCart(jersey, size) {
    setCartCount(cartCount + 1);
  }

  // Sample jersey data
  const realMadrid = {
    name: 'Real Madrid 2024/25 Home Kit',
    team: 'Real Madrid',
    league: 'La Liga',
    price: 89.99,
    originalPrice: 109.99,
    imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=600&q=80',
    inStock: true
  };

  const barcelona = {
    name: 'FC Barcelona 125th Anniversary Kit',
    team: 'FC Barcelona',
    league: 'La Liga',
    price: 89.99,
    originalPrice: 109.99,
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80',
    inStock: true
  };

  const arsenal = {
    name: 'Arsenal 2024/25 Home Kit',
    team: 'Arsenal',
    league: 'Premier League',
    price: 84.99,
    originalPrice: 99.99,
    imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80',
    inStock: false
  };

  return (
    <div className="app">
      {/* Passing cartCount state down to Navbar via Props! */}
      <Navbar cartCount={cartCount} />

      <main className="main-content">
        <section className="hero-section">
          <h1>WEAR THE ARMOR. <span className="highlight">FEEL THE GLORY.</span></h1>
          <p>Official authentic club kits, legendary retro treasures, and bespoke player customization.</p>
        </section>

        {/* Passing handleAddToCart handler down to JerseyCards via Props! */}
        <div className="jersey-grid">
          <JerseyCard jersey={realMadrid} onAddToCart={handleAddToCart} />
          <JerseyCard jersey={barcelona} onAddToCart={handleAddToCart} />
          <JerseyCard jersey={arsenal} onAddToCart={handleAddToCart} />
        </div>
      </main>
    </div>
  );
}

export default App;
