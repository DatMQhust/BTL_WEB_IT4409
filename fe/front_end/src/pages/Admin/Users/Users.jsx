import React, { useEffect, useState } from 'react';
import { getCustomerStats, getAllUsers, deleteUser } from '../../../services/admin.service';
import './Users.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [customerStats, setCustomerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const usersResponse = await getAllUsers();
      const usersData = usersResponse.data?.users || usersResponse.users || [];
      setUsers(Array.isArray(usersData) ? usersData : []);

      // Fetch customer stats
      const statsResponse = await getCustomerStats();
      setCustomerStats(statsResponse.data.stats);
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu người dùng');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      await deleteUser(userId);
      alert('Xóa người dùng thành công!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa người dùng');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="users-loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="users-error">Lỗi: {error}</div>;
  }

  return (
    <div className="users-container">
      <h1 className="users-title">Quản lý người dùng</h1>

      {/* Top Customers Stats */}
      {customerStats && customerStats.topCustomers && customerStats.topCustomers.length > 0 && (
        <section className="top-customers-section">
          <h2 className="section-title">Top 10 khách hàng</h2>
          <div className="top-customers-grid">
            {customerStats.topCustomers.map((customer, index) => (
              <div key={customer.userId} className="customer-card">
                <div className="customer-rank">#{index + 1}</div>
                <div className="customer-info">
                  <h3>{customer.name}</h3>
                  <p className="customer-email">{customer.email}</p>
                  <div className="customer-stats">
                    <div>
                      <span className="stat-label">Tổng chi tiêu:</span>
                      <span className="stat-value">{formatCurrency(customer.totalSpent)}</span>
                    </div>
                    <div>
                      <span className="stat-label">Số đơn hàng:</span>
                      <span className="stat-value">{customer.orderCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Users List */}
      <section className="users-list-section">
        <div className="users-header">
          <h2 className="section-title">Danh sách người dùng</h2>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredUsers.length === 0 ? (
          <p className="no-data">Không tìm thấy người dùng nào</p>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Ngày đăng ký</th>
                  <th>Vai trò</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber || 'N/A'}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <span className={`role-badge ${user.role === 'admin' ? 'admin-badge' : 'user-badge'}`}>
                        {user.role === 'admin' ? 'Admin' : 'Người dùng'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={user.role === 'admin'}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
