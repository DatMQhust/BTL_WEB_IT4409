import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <h2 className="sidebar-title">ADMIN</h2>

      <nav className="sidebar-menu">
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/books">Quản lý sách</NavLink>
        <NavLink to="/admin/author">Quản lý tác giả</NavLink>
        <NavLink to="/admin/users">Quản lý người dùng</NavLink>
        <NavLink to="/admin/orders">Quản lý đơn hàng</NavLink>
      </nav>
    </aside>
  );
}
