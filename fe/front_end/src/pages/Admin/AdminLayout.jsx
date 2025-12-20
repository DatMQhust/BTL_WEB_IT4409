import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";
import "./Adminlayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
