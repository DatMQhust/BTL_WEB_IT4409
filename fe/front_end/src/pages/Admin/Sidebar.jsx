import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";



export default function Sidebar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  if (!user) {
    return (
      <aside className="admin-sidebar">
        <div className="admin-profile-loading">
          <span>Đang tải...</span>
        </div>
        <h2 className="sidebar-title">CHÀO MỪNG TRỞ LẠI</h2>
        <nav className="sidebar-menu">
        </nav>
      </aside>
    );
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-profile" ref={menuRef}>
        <button
          className="admin-profile-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>          
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=c7d2fe&color=3730a3&bold=true&size=128`}
            alt="Avatar" className="admin-avatar"/>
          <div className="admin-info">
            <span className="admin-name">{user.name}</span>
            <span className="admin-role">Quản trị viên</span>
          </div>
          <svg className={`dropdown-arrow ${showProfileMenu ? 'rotated' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {showProfileMenu && (
          <div className="admin-dropdown">
            <button onClick={handleLogout} className="admin-logout-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
      <h2 className="sidebar-title">CHÀO MỪNG TRỞ LẠI</h2>

      <nav className="sidebar-menu">
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/book">Quản lý sách</NavLink>
        <NavLink to="/admin/author">Quản lý tác giả</NavLink>
        <NavLink to="/admin/user">Quản lý người dùng</NavLink>
        <NavLink to="/admin/order">Quản lý đơn hàng</NavLink>
      </nav>
    </aside>
  );
}
