import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DiscoveryBar from './components/DiscoveryBar';
import JerseyCard from './components/JerseyCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import './App.css';

function App() {
  // 1. STATE: Cart Items List
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 2. STATE: Wishlist Items List
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // 3. STATE: Selected League / Club Filter
  const [selectedLeague, setSelectedLeague] = useState('all');

  // 4. STATE: Active Product Detail Modal
  const [activeJerseyDetail, setActiveJerseyDetail] = useState(null);

  // Master Curated Catalog of Football Kits with INR Pricing & Full Details
  const allJerseys = [
    {
      id: 1,
      name: 'Real Madrid 2024/25 Authentic Home Kit',
      team: 'Real Madrid',
      league: 'La Liga',
      season: '24/25',
      price: 899,
      originalPrice: 1499,
      imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80',
      inStock: true,
      description:
        "The official 2024/25 Real Madrid Home Jersey honors the club's eternal elegance and unmatched European dominance. Crafted with an exclusive houndstooth texture inspired by traditional 'chulapo' attire from Madrid's annual San Isidro Fiesta, this kit embodies pure royal Madridismo.",
      features: [
        'Official Master-Quality matchday player edition',
        'HEAT.RDY cooling fabric technology with engineered mesh ventilation',
        'Metallic gold Real Madrid embroidered crest and accents',
        'Official LALIGA EA SPORTS sleeve badge included',
        '100% Recycled polyester double-knit performance fabric'
      ]
    },
    {
      id: 2,
      name: 'FC Barcelona 125th Anniversary Home Kit',
      team: 'FC Barcelona',
      league: 'La Liga',
      season: '24/25',
      price: 899,
      originalPrice: 1499,
      imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
      inStock: true,
      description:
        "Commemorating 125 years of Blaugrana glory (1899–2024). Features the iconic half-and-half design inspired by the club's very first kit worn by Joan Gamper, accented with commemorative gold anniversary crest detailing and Catalan Senyera pride.",
      features: [
        '125th Anniversary official commemorative edition',
        'Dri-FIT ADV advanced sweat-wicking match fabric',
        'Special edition central 125-year gold-trimmed crest',
        'Catalan Senyera flag detailing on the upper back neck',
        'Official Spotify and Ambilight TV match sponsors'
      ]
    },
    {
      id: 3,
      name: 'Manchester City 2024/25 Authentic Home Kit',
      team: 'Manchester City',
      league: 'Premier League',
      season: '24/25',
      price: 849,
      originalPrice: 1399,
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      inStock: true,
      description:
        "Inspired by Manchester's iconic '0161' telephone dial code, woven directly into the collar and cuffs as a tribute to City's roots and unstoppable Treble-winning era under Pep Guardiola.",
      features: [
        'Authentic ULTRAWEAVE 4-way stretch match performance jersey',
        '0161 Manchester area code graffiti pattern knitted into collar and trims',
        'Official Premier League Champions gold sleeve badge',
        'dryCELL moisture management technology',
        'Tailored athletic aerodynamic silhouette'
      ]
    },
    {
      id: 4,
      name: 'Arsenal 2024/25 Cannon Crest Home Kit',
      team: 'Arsenal',
      league: 'Premier League',
      season: '24/25',
      price: 849,
      originalPrice: 1399,
      imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
      inStock: false,
      description:
        "For the first time in 35 years, the standalone historic Arsenal Cannon takes center stage across the red and white chest, honoring the club's defensive legacy and Highbury tradition.",
      features: [
        'Historic standalone Cannon crest replacing the standard shield badge',
        'HEAT.RDY breathable lightweight match performance weave',
        'Navy blue side piping inspired by the iconic 1997/98 double-winning squad',
        'Official Premier League matchday lettering font ready',
        '100% Recycled polyester mesh'
      ]
    },
    {
      id: 5,
      name: 'Argentina 2024 World Champions Copa Edition',
      team: 'Argentina',
      league: 'International',
      season: '2024',
      price: 949,
      originalPrice: 1599,
      imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
      inStock: true,
      description:
        'The jersey of champions. Featuring classic sky-blue and white vertical stripes emblazoned with the three golden stars and the official FIFA World Champions golden chest badge.',
      features: [
        'Official 3-Star FIFA World Champions edition',
        'Gold FIFA World Cup Champions center crest',
        'AFA crest with metallic gold trim and sun of May icon',
        'Engineered jacquard airflow mesh for optimum performance in match heat',
        'Official Messi #10 flocking configuration ready'
      ]
    },
    {
      id: 6,
      name: 'AC Milan 2006/07 Athens Champions League Retro',
      team: 'AC Milan',
      league: 'Retro',
      season: '06/07',
      price: 799,
      originalPrice: 1299,
      imageUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=800&q=80',
      inStock: true,
      description:
        "The iconic all-white 'Maglia Fortunata' lucky kit worn by Kaká, Inzaghi, and Maldini in Athens to lift the 2007 UEFA Champions League trophy against Liverpool.",
      features: [
        'Faithful archival reproduction of the Athens 2007 UCL Final jersey',
        'Embroidered AC Milan crest with 7-time Champions League trophy badge on sleeve',
        'Classic Bwin flocking on chest',
        'Breathable vintage polyester knit with retro collar and button placket',
        'The definitive collector piece for Rossoneri purists'
      ]
    }
  ];

  // Client-side filtering by league or club name
  const filteredJerseys = allJerseys.filter((jersey) => {
    if (selectedLeague === 'all') return true;
    return (
      jersey.league.toLowerCase() === selectedLeague.toLowerCase() ||
      jersey.team.toLowerCase().includes(selectedLeague.toLowerCase())
    );
  });

  // Derived totals
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Handler: Add to Cart (with specific size and quantity)
  function handleAddToCart(jersey, size = 'M') {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === jersey.id && item.size === size
      );

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
            id: jersey.id,
            name: jersey.name,
            team: jersey.team,
            price: jersey.price,
            imageUrl: jersey.imageUrl,
            size: size,
            quantity: 1
          }
        ];
      }
    });

    // Auto-open Cart Drawer
    setIsCartOpen(true);
  }

  // Handler: Update Quantity in Cart
  function handleUpdateQuantity(id, size, delta) {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id && item.size === size) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  }

  // Handler: Remove Item from Cart
  function handleRemoveFromCart(id, size) {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.size === size))
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
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* 2. Hero Section */}
      <Hero
        onQuickAdd={handleAddToCart}
        onOpenDetails={() => {
          const match = allJerseys.find((j) => j.team === 'Real Madrid') || allJerseys[0];
          setActiveJerseyDetail(match);
        }}
      />

      {/* 3. Sleek Non-Sticky Discovery Bar */}
      <DiscoveryBar
        selectedLeague={selectedLeague}
        onSelectLeague={setSelectedLeague}
        totalCount={filteredJerseys.length}
      />

      {/* 4. Product Catalog Grid */}
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
                isWishlisted={wishlistItems.some((item) => item.id === jersey.id)}
                onOpenDetails={(selected) => setActiveJerseyDetail(selected)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        </div>
      </main>

      {/* 5. Minimal Natural Studio Footer */}
      <footer className="vault-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-logo">⚽ JERSEY4U</span>
            <span className="footer-tagline">THE FOOTBALL VAULT • 100% EMBROIDERED MERCHANDISE</span>
          </div>
          <p className="footer-copy">© 2026 Jersey4U India. Built with Spring Boot 3, MySQL 8 & React.</p>
        </div>
      </footer>

      {/* 6. Product Detail Modal (Single Card Open & Description View) */}
      <ProductDetailModal
        jersey={activeJerseyDetail}
        onClose={() => setActiveJerseyDetail(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
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
      />

      {/* 8. Slide-Over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveWishlist={handleRemoveWishlist}
        onMoveToCart={handleAddToCart}
      />
    </div>
  );
}

export default App;
