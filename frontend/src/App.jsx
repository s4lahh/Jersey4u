import Navbar from './components/Navbar';
import JerseyCard from './components/JerseyCard';
import './App.css';

function App() {
  // 1. Data created in the Parent (App)
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
    inStock: false // Out of stock to test our disabled button prop!
  };

  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <section className="hero-section">
          <h1>Welcome to <span className="highlight">Jersey4U</span></h1>
          <p>Authentic Club, National & Retro Football Kits</p>
        </section>

        {/* 2. Passing data DOWN to child components via Props! */}
        <div className="jersey-grid">
          <JerseyCard jersey={realMadrid} />
          <JerseyCard jersey={barcelona} />
          <JerseyCard jersey={arsenal} />
        </div>
      </main>
    </div>
  );
}

export default App;
