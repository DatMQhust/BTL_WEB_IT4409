import React, { useState, useEffect, useRef } from "react";
import './Navbar.css'; // Sử dụng file CSS thông thường
import Logo from "../../assets/website/logo.png";
import {
  Bell, BellDot, Menu, X, BookOpen,
  ShoppingCart, CreditCard
} from "lucide-react";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ setShowLogin = () => { }, token, setToken = () => { } }) => {
  const location = useLocation();

  const hasToken = !!token;

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
          {/* If not logged in */}
          {!hasToken && (
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
