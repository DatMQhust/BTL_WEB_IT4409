import React, { useState, useEffect, useRef } from "react";
import './Navbar.css';
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = ({ setShowLogin = () => {} }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null); 

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const NavLink = ({ to, children, className = '' }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className={`nav-link ${isActive ? 'active' : ''} ${className}`}>
        {children}
      </Link>
    );
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  // Mở menu khi click vào avatar
  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const CartIcon = () => (
    <div className="cart-icon-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cart-icon">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {cartItemCount > 0 && (
        <span className="cart-badge">{cartItemCount > 99 ? '99+' : cartItemCount}</span>
      )}
    </div>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LEFT — LOGO */}
        <div className="navbar-left">
          <Link to="/" className="logo-link">Group06</Link>
        </div>

        {/* RIGHT — MENU & USER */}
        <div className="navbar-right">
          <div className="navbar-menu">
            <NavLink to="/">Trang chủ</NavLink>
            <NavLink to="/books">Sản phẩm</NavLink>
            <NavLink to="/cart">
              <CartIcon />
            </NavLink>
          </div>

          <div className="user-section">
            {user ? (
              <div className="profile-container" ref={profileRef}>
                {/* Click vào button để mở/đóng menu */}
                <button className="profile-button" onClick={toggleProfileMenu}>
                  <div className="navbar-avatar-wrapper">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=c7d2fe&color=3730a3`}
                      alt="Avatar"
                      className="navbar-avatar"
                    />
                    <span className="navbar-online-indicator"></span>
                  </div>
                  <span className="navbar-username">{user.name}</span>
                  <svg className={`dropdown-arrow ${showProfileMenu ? 'rotated' : ''}`} width="12" height="8" viewBox="0 0 12 8">
                    <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </button>

                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                      Hồ sơ
                    </Link>
                    <Link to="/order" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                      Đơn hàng
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item admin-link" onClick={() => setShowProfileMenu(false)}>
                        Quản trị
                      </Link>
                    )}
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="login-button">
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;