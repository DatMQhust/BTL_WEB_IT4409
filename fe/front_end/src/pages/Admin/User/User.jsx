import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getCustomerStats, getAllUsers, deleteUser, updateUserRole } from "../../../services/admin.service";
import "./User.css";

export default function User() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("stats"); // "stats" or "users"
  
  // Kiểm tra quyền admin
  useEffect(() => {
    if (!user) {
      alert("Vui lòng đăng nhập để truy cập trang này!");
      navigate("/");
      return;
    }
    if (user.role !== "admin") {
      alert("Bạn không có quyền truy cập trang này!");
      navigate("/");
      return;
    }
  }, [user, navigate]);
  
  // User management states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch stats and users in parallel
      const [statsRes, usersRes] = await Promise.all([
        getCustomerStats(),
        getAllUsers()
      ]);

      if (statsRes.status === "success") {
        setStats(statsRes.data.stats);
      }

      if (usersRes.status === "success") {
        setUsers(usersRes.data.users);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}"?`)) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      alert("Xóa người dùng thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa người dùng: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateRole = async (userId, currentRole, userName) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Bạn có muốn đổi quyền của "${userName}" từ ${currentRole} thành ${newRole}?`)) {
      return;
    }

    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      alert(`Đã cập nhật quyền thành ${newRole}!`);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật quyền: " + (err.response?.data?.message || err.message));
    }
  };

  const formatVND = (amount = 0) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.includes(searchTerm);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) return <div className="user-loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="user-error">{error}</div>;

  return (
    <div className="user-page">
      <h1 className="user-title">Quản lý người dùng</h1>

      {/* Tabs */}
      <div className="user-tabs">
        <button 
          className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          📊 Thống kê khách hàng
        </button>
        <button 
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 Danh sách người dùng ({users.length})
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === "stats" && stats && (
        <div className="stats-content">
          {/* Top Customers */}
          <section className="user-section">
            <h2>Khách hàng chi tiêu nhiều nhất</h2>

            <table className="user-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số đơn</th>
                  <th>Tổng chi tiêu</th>
                </tr>
              </thead>
              <tbody>
                {stats.topCustomers.map((u, index) => (
                  <tr key={u.userId}>
                    <td>{index + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.orderCount}</td>
                    <td className="money">{formatVND(u.totalSpent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Customer Growth */}
          <section className="user-section">
            <h2>Tăng trưởng khách hàng theo tháng</h2>

            <table className="user-table growth-table">
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Số khách hàng mới</th>
                </tr>
              </thead>
              <tbody>
                {stats.customerGrowth.map((item) => (
                  <tr key={item._id}>
                    <td>Tháng {item._id}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="users-content">
          {/* Filters */}
          <div className="users-filters">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="role-filter"
            >
              <option value="all">Tất cả quyền</option>
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
            <div className="filter-info">
              Hiển thị {currentUsers.length} / {filteredUsers.length} người dùng
            </div>
          </div>

          {/* Users Table */}
          <section className="user-section">
            <table className="user-table users-management-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Quyền</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td>{indexOfFirstUser + index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || "N/A"}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role === "admin" ? "👑 Admin" : "👤 User"}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-role"
                            onClick={() => handleUpdateRole(user._id, user.role, user.name)}
                            title={`Đổi quyền thành ${user.role === "admin" ? "User" : "Admin"}`}
                          >
                            🔄
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            title="Xóa người dùng"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                ← Trước
              </button>
              <span className="page-info">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}