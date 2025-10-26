import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { FaBell, FaCaretDown } from "react-icons/fa";
import Logo from "../../assets/website/logo.png";
import "./navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const user = {
    full_name: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  const notifications = [
    { id: 1, message: "Bạn đã đặt mua 'Ăn Dặm Không Nước Mắt'" },
    { id: 2, message: "Đơn hàng của bạn đang được giao!" },
  ];

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* Logo */}
        <div className="navbar-logo">
          <img src={Logo} alt="Books Logo" className="navbar-logo-img" />
          <span className="navbar-logo-text">Books</span>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${
              location.pathname === "/" ? "active" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/books"
            className={`nav-link ${
              location.pathname.startsWith("/books") ? "active" : ""
            }`}
          >
            Books List
          </Link>
          <Link
            to="/cart"
            className={`nav-link ${
              location.pathname.startsWith("/cart") ? "active" : ""
            }`}
          >
            Cart
          </Link>
          <Link
            to="/order"
            className={`nav-link ${
              location.pathname.startsWith("/order") ? "active" : ""
            }`}
          >
            Order
          </Link>
        </div>

        {/* Right Side */}
        <div className="navbar-right">
          {/* Notification */}
          <div className="notification-wrapper">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="notification-btn"
            >
              <FaBell size={20} />
            </button>
            {showNotifications && (
              <div className="notification-dropdown">
                <h4>Thông báo</h4>
                {notifications.map((n) => (
                  <p key={n.id}>{n.message}</p>
                ))}
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div
            className="profile-wrapper"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img
              src={user.avatar}
              alt="Avatar"
              className="profile-avatar"
            />
            <span className="profile-name">{user.full_name}</span>
            <FaCaretDown size={14} />
            {showProfileMenu && (
              <div className="profile-dropdown">
                <Link to="/profile">Trang cá nhân</Link>
                <Link to="/logout">Đăng xuất</Link>
              </div>
            )}
          </div>

          {/* Login Button */}
          <button className="login-btn">Login</button>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link">
            Home
          </Link>
          <Link to="/books" className="mobile-link">
            Books List
          </Link>
          <Link to="/cart" className="mobile-link">
            Cart
          </Link>
          <Link to="/order" className="mobile-link">
            Order
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
