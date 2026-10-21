import React, { useMemo, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Navbar = () => {
  const { user, logout, cart, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // Close mobile menu after navigating
  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname]);

  // Prevent background scrolling while logout modal is open
  useEffect(() => {
    if (!showLogout) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowLogout(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showLogout]);

  const handleLogout = () => {
    logout();
    setShowLogout(false);
    setShowMenu(false);
    navigate('/login');
  };

  const closeMenu = () => setShowMenu(false);

  // Active class for Products and Product Details pages
  const productsActive =
    location.pathname === '/products' ||
    location.pathname.startsWith('/product/');

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <NavLink to="/" end className="logo" onClick={closeMenu}>
          
          <span> ˚₊‧꒰ა 𝓨𝓸𝓾𝓻 𝓛𝓲𝓽𝓽𝓵𝓮 𝓢𝓽𝓸𝓻𝓮 ໒꒱ ‧₊˚ </span>
          
        </NavLink>

        {/* Desktop navigation */}
        <div className="nav-links desktop-nav">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={productsActive ? 'active' : ''}
          >
            Products
          </NavLink>

          <NavLink to="/contact">
            Contact
          </NavLink>

          <NavLink to="/cart" className="cart-link">
            <span className="cart-label">Cart</span>
            <span className="cart-emoji">🛒</span>
            <span className="cart-count">{cartCount}</span>
          </NavLink>

          <button
            type="button"
            onClick={toggleTheme}
            className="theme-btn"
            aria-label="Toggle color theme"
            title="Toggle theme"
          >
            {theme === 'light' ? '☾' : '☀'}
          </button>

          {user ? (
            <div className="user-menu">
              <button
                type="button"
                className="user-button"
                onClick={() => setShowMenu((prev) => !prev)}
                aria-expanded={showMenu}
              >
                Hi, {user.name} ▾
              </button>

              {showMenu && (
                <div className="user-dropdown">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowLogout(true);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="login-link">
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile header actions */}
        <div className="mobile-actions">
          <NavLink
            to="/cart"
            className="mobile-cart"
            aria-label={`Shopping cart, ${cartCount} items`}
            onClick={closeMenu}
          >
            🛒
            <span className="cart-count">{cartCount}</span>
          </NavLink>

          <button
            type="button"
            onClick={toggleTheme}
            className="theme-btn mobile-theme-btn"
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? '☾' : '☀'}
          </button>

          <button
            type="button"
            className={`hamburger-btn ${showMenu ? 'active' : ''}`}
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label={
              showMenu
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={showMenu}
            aria-controls="mobile-navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile dropdown navigation */}
        <div
          id="mobile-navigation"
          className={`mobile-nav ${showMenu ? 'mobile-nav-open' : ''}`}
          aria-hidden={!showMenu}
        >
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={productsActive ? 'active' : ''}
            onClick={closeMenu}
          >
            Products
          </NavLink>

          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>

          <NavLink
            to="/cart"
            className="mobile-nav-cart"
            onClick={closeMenu}
          >
            Cart <span className="cart-count">{cartCount}</span>
          </NavLink>

          {user ? (
            <>
              <div className="mobile-user-greeting">
                Hi, {user.name}
              </div>

              <button
                type="button"
                className="mobile-logout-link"
                onClick={() => {
                  setShowMenu(false);
                  setShowLogout(true);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" onClick={closeMenu}>
              Login
            </NavLink>
          )}
        </div>
      </nav>

      {/* Logout confirmation modal */}
      {showLogout && (
        <div
          className="logout-overlay"
          onClick={() => setShowLogout(false)}
        >
          <div
            className="logout-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="logout-icon">➜]</div>

            <h2 id="logout-title">Log out?</h2>

            <p>Are you sure you want to log out?</p>

            <div className="logout-actions">
              <button
                type="button"
                className="cancel-logout"
                onClick={() => setShowLogout(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-logout"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
