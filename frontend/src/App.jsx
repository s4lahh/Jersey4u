import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DiscoveryBar from './components/DiscoveryBar';
import JerseyCard from './components/JerseyCard';
import CustomizerAtelier from './components/CustomizerAtelier';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import './App.css';

function App() {
  // 1. STATE: Live Jerseys Data from Spring Boot + MySQL
  const [jerseys, setJerseys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. STATE: Cart Items List
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 3. STATE: Wishlist Items List
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // 4. STATE: Selected League / Club Filter
  const [selectedLeague, setSelectedLeague] = useState('all');

  // 5. STATE: Active Product Detail Modal
  const [activeJerseyDetail, setActiveJerseyDetail] = useState(null);

  // 6. STATE: Controlled Search Query & Customizer Selection (Lesson 7)
  const [searchQuery, setSearchQuery] = useState('');
  const [customizerKitId, setCustomizerKitId] = useState(1);

  // 7. STATE: Checkout Modal (Lesson 8)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // LESSON 6: Fetch Real Kits from Spring Boot REST API
  async function fetchJerseysFromVault() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8081/api/jerseys');
      if (!response.ok) {
        throw new Error(`Spring Boot returned status ${response.status}`);
      }

      const data = await response.json();
      setJerseys(data);
    } catch (err) {
      console.error('Error fetching jerseys from backend:', err);
      setError(
        'Unable to reach the Jersey4U Spring Boot backend on port 8081. Please ensure the server is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  // Empty dependency array [] -> runs ONLY ONCE when App mounts!
  useEffect(() => {
    fetchJerseysFromVault();
  }, []);

  // Client-side filtering by league/club AND live search query
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredJerseys = jerseys.filter((jersey) => {
    const matchesLeague =
      selectedLeague === 'all' ||
      jersey.league?.toLowerCase() === selectedLeague.toLowerCase() ||
      jersey.team?.toLowerCase().includes(selectedLeague.toLowerCase());

    const matchesSearch =
      !normalizedQuery ||
      jersey.name?.toLowerCase().includes(normalizedQuery) ||
      jersey.team?.toLowerCase().includes(normalizedQuery) ||
      jersey.league?.toLowerCase().includes(normalizedQuery);

    return matchesLeague && matchesSearch;
  });

  // Derived totals
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Handler: Add to Cart (supports blank kits AND custom printed kits via composite lineKey)
  function handleAddToCart(jersey, size = 'M', customization = null) {
    const customName = customization?.customName?.trim() || '';
    const customNumber = customization?.customNumber?.trim() || '';
    const fontFinish = customization?.fontFinish || 'standard';
    const sleevePatch = customization?.sleevePatch || 'none';
    const lineKey = `${jersey.id}-${size}-${customName}-${customNumber}-${fontFinish}-${sleevePatch}`;
    const unitPrice = customization?.totalPrice ?? Number(jersey.price);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.lineKey === lineKey);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            lineKey,
            id: jersey.id,
            name: jersey.name,
            team: jersey.team,
            price: unitPrice,
            imageUrl: jersey.imageUrl,
            size: size,
            customName,
            customNumber,
            fontFinish,
            sleevePatch,
            quantity: 1
          }
        ];
      }
    });

    // Auto-open Cart Drawer
    setIsCartOpen(true);
  }

  // Handler: Update Quantity in Cart
  function handleUpdateQuantity(lineKey, delta) {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          const currentKey = item.lineKey || `${item.id}-${item.size}`;
          if (currentKey === lineKey) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  }

  // Handler: Remove Item from Cart
  function handleRemoveFromCart(lineKey) {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item.lineKey || `${item.id}-${item.size}`) !== lineKey)
    );
  }

  // Handler: Toggle Wishlist
  function handleToggleWishlist(jersey, isNowLiked) {
    setWishlistItems((prevItems) => {
      if (isNowLiked) {
        if (!prevItems.some((item) => item.id === jersey.id)) {
          return [...prevItems, jersey];
        }
        return prevItems;
      } else {
        return prevItems.filter((item) => item.id !== jersey.id);
      }
    });
  }

  // Handler: Remove from Wishlist
  function handleRemoveWishlist(jersey) {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.id !== jersey.id)
    );
  }

  return (
    <div className="app-layout">
      {/* 1. Header with Connected Navigation & Triggers */}
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        selectedLeague={selectedLeague}
        onSelectLeague={setSelectedLeague}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* 2. Hero Section */}
      <Hero
        onQuickAdd={handleAddToCart}
        onOpenDetails={(heroKit) => {
          const match = jerseys.find((j) => j.team === 'Real Madrid') || jerseys[0] || heroKit;
          setActiveJerseyDetail(match);
        }}
      />

      {/* 3. Sleek Non-Sticky Discovery Bar */}
      <DiscoveryBar
        selectedLeague={selectedLeague}
        onSelectLeague={setSelectedLeague}
        totalCount={filteredJerseys.length}
      />

      {/* 4. Product Catalog Grid (Now powered by MySQL + Spring Boot!) */}
      <main className="catalog-wrapper" id="catalog">
        <div className="catalog-container">
          <div className="catalog-header">
            <div>
              <span className="section-kicker">LIVE VAULT DATABASE</span>
              <h2 className="section-title">
                {selectedLeague === 'all' ? 'All Vault Kits' : `${selectedLeague} Collection`}
              </h2>
            </div>
            <span className="results-badge">
              {loading ? 'Syncing...' : `${filteredJerseys.length} Kits Available`}
            </span>
          </div>

          {loading ? (
            <div className="catalog-loading">
              <div className="loading-spinner"></div>
              <p>Fetching official kits from Spring Boot &amp; MySQL...</p>
            </div>
          ) : error ? (
            <div className="catalog-error-card">
              <h3>⚠️ Vault Connection Interrupted</h3>
              <p>{error}</p>
              <button type="button" className="retry-btn" onClick={fetchJerseysFromVault}>
                🔄 Retry Connection
              </button>
            </div>
          ) : filteredJerseys.length === 0 ? (
            <div className="catalog-empty-state">
              <p>
                No kits found
                {selectedLeague !== 'all' ? ` for "${selectedLeague}"` : ''}
                {searchQuery.trim() ? ` matching "${searchQuery.trim()}"` : ''}.
              </p>
              <button
                type="button"
                className="retry-btn"
                onClick={() => {
                  setSelectedLeague('all');
                  setSearchQuery('');
                }}
              >
                Show All Vault Kits
              </button>
            </div>
          ) : (
            <div className="jersey-grid">
              {filteredJerseys.map((jersey) => (
                <JerseyCard
                  key={jersey.id}
                  jersey={jersey}
                  isWishlisted={wishlistItems.some((item) => item.id === jersey.id)}
                  onOpenDetails={(selected) => setActiveJerseyDetail(selected)}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 5. Interactive 2D Jersey Customizer Atelier (Lesson 7) */}
      <CustomizerAtelier
        jerseys={jerseys}
        selectedKitId={customizerKitId}
        onSelectKitId={setCustomizerKitId}
        onAddCustomToCart={handleAddToCart}
      />

      {/* 6. Minimal Natural Studio Footer */}
      <footer className="vault-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-logo">⚽ JERSEY4U</span>
            <span className="footer-tagline">THE FOOTBALL VAULT • 100% EMBROIDERED MERCHANDISE</span>
          </div>
          <p className="footer-copy">© 2026 Jersey4U India. Built with Spring Boot 3, MySQL 8 &amp; React.</p>
        </div>
      </footer>

      {/* 6. Product Detail Modal */}
      <ProductDetailModal
        jersey={activeJerseyDetail}
        onClose={() => setActiveJerseyDetail(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onCustomize={(kit) => {
          setCustomizerKitId(kit.id);
          const el = document.getElementById('customizer');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        isWishlisted={
          activeJerseyDetail
            ? wishlistItems.some((item) => item.id === activeJerseyDetail.id)
            : false
        }
      />

      {/* 7. Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 8. Slide-Over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveWishlist={handleRemoveWishlist}
        onMoveToCart={handleAddToCart}
      />

      {/* 9. Full-Stack Checkout Modal (Lesson 8) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={() => setCartItems([])}
      />
    </div>
  );
}

export default App;
