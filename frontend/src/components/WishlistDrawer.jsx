import './WishlistDrawer.css';

function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems = [],
  onRemoveWishlist,
  onMoveToCart
}) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="drawer-panel wishlist-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-box">
            <span className="drawer-icon">❤️</span>
            <div>
              <h3 className="drawer-title">YOUR SAVED KITS</h3>
              <span className="drawer-count">{wishlistItems.length} Kits Saved</span>
            </div>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close wishlist"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {wishlistItems.length === 0 ? (
            <div className="empty-cart-state">
              <span className="empty-icon">🤍</span>
              <h4>Your Wishlist is Empty</h4>
              <p>
                Found a kit you want to save for matchday? Click the heart icon on any jersey card to keep it here!
              </p>
              <button
                type="button"
                className="continue-shopping-btn"
                onClick={onClose}
              >
                Browse All Kits →
              </button>
            </div>
          ) : (
            <ul className="wishlist-items-list">
              {wishlistItems.map((jersey) => (
                <li key={jersey.id} className="wishlist-item-card">
                  <img
                    src={jersey.imageUrl}
                    alt={jersey.name}
                    className="wishlist-item-thumb"
                  />

                  <div className="wishlist-item-details">
                    <span className="wishlist-item-team">{jersey.team}</span>
                    <h5 className="wishlist-item-name">{jersey.name}</h5>
                    <span className="wishlist-item-price">₹{jersey.price}</span>

                    <div className="wishlist-actions-row">
                      <button
                        type="button"
                        className="move-to-bag-btn"
                        onClick={() => {
                          onMoveToCart(jersey, 'M');
                        }}
                      >
                        + Add to Bag (M) 🛒
                      </button>

                      <button
                        type="button"
                        className="remove-wishlist-btn"
                        onClick={() => onRemoveWishlist(jersey)}
                        title="Remove from Wishlist"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="drawer-footer">
            <p className="wishlist-footer-tip">
              💡 Kits in your wishlist are saved for this session. Add them to your bag to lock in your size before stock runs out!
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default WishlistDrawer;
