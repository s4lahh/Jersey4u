import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="app">
      {/* 1. Our First Custom Child Component */}
      <Navbar />

      {/* 2. Hero Section */}
      <main className="main-content">
        <section className="hero-section">
          <h1>Welcome to <span className="highlight">Jersey4U</span></h1>
          <p>Authentic Club, National & Retro Football Kits</p>
        </section>
      </main>
    </div>
  );
}

export default App;
