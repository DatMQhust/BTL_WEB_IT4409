import React, { useState, useEffect, useRef } from "react";
import './Navbar.css'; // Sử dụng file CSS thông thường
import Logo from "../../assets/website/logo.png";
import {
  Bell, Menu
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ setShowLogin = () => { } }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const NavLink = ({ to, children }) => {
    const isActive =
      location.pathname === to ||
      (to !== "/" && location.pathname.startsWith(to));

    return (
      <Link
        to={to}
        className={`nav-link ${isActive ? 'active' : ''}`}
      >
        {children}
      </Link>
    );
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    // Optionally navigate to home or login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LEFT — LOGO + TEXT */}
        <div className="navbar-left">
          <img src={Logo} alt="Logo" className="logo-image" />
          <div>
            <p className="logo-title">Books</p>
            <p className="logo-subtitle">Modern bookstore</p>
          </div>
        </div>

        {/* MIDDLE — NAV MENU */}
        <div className="navbar-middle">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/books">Books</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/placeorder">Order</NavLink>
        </div>

        {/* RIGHT — ACTIONS */}
        <div className="navbar-right">
          {user ? (
            <div className="profile-menu-container" ref={menuRef}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="profile-avatar-button">
                {user.name?.charAt(0).toUpperCase()}
              </button>
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <p className="dropdown-username">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="login-button"
            >
              Login
            </button>
          )}

          {/* Notification icon always right side */}
          <button className="icon-button">
            <Bell size={24} />
          </button>

          {/* Mobile menu */}
          <button className="icon-button mobile-menu-button">
            <Menu size={28} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
