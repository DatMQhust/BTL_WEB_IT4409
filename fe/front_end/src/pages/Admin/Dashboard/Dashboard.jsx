import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../../services/admin.service';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      setStats(response.data.stats);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu dashboard');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return <div className="dashboard-loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="dashboard-error">Lỗi: {error}</div>;
  }

  if (!stats) {
    return <div className="dashboard-error">Không có dữ liệu</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>

      {/* Revenue Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Doanh thu</h2>
        <div className="stats-grid">
          <div className="stat-card revenue-card">
            <h3>Tổng doanh thu</h3>
            <p className="stat-value">{formatCurrency(stats.revenue.total)}</p>
          </div>
          <div className="stat-card">
            <h3>Hôm nay</h3>
            <p className="stat-value">{formatCurrency(stats.revenue.today)}</p>
          </div>
          <div className="stat-card">
            <h3>Tháng này</h3>
            <p className="stat-value">{formatCurrency(stats.revenue.thisMonth)}</p>
          </div>
          <div className="stat-card">
            <h3>Năm nay</h3>
            <p className="stat-value">{formatCurrency(stats.revenue.thisYear)}</p>
          </div>
        </div>
      </section>

      {/* Orders Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Đơn hàng</h2>
        <div className="stats-grid">
          <div className="stat-card orders-card">
            <h3>Tổng đơn hàng</h3>
            <p className="stat-value">{stats.orders.total}</p>
          </div>
          <div className="stat-card">
            <h3>Hôm nay</h3>
            <p className="stat-value">{stats.orders.today}</p>
          </div>
          <div className="stat-card">
            <h3>Tháng này</h3>
            <p className="stat-value">{stats.orders.thisMonth}</p>
          </div>
        </div>
        
        {stats.orders.byStatus && Object.keys(stats.orders.byStatus).length > 0 && (
          <div className="orders-status-section">
            <h3>Theo trạng thái</h3>
            <div className="status-grid">
              {Object.entries(stats.orders.byStatus).map(([status, count]) => (
                <div key={status} className="status-item">
                  <span className="status-label">{getStatusLabel(status)}:</span>
                  <span className="status-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Customers Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Khách hàng</h2>
        <div className="stats-grid">
          <div className="stat-card customers-card">
            <h3>Tổng khách hàng</h3>
            <p className="stat-value">{stats.customers.total}</p>
          </div>
          <div className="stat-card">
            <h3>Mới hôm nay</h3>
            <p className="stat-value">{stats.customers.newToday}</p>
          </div>
          <div className="stat-card">
            <h3>Mới tháng này</h3>
            <p className="stat-value">{stats.customers.newThisMonth}</p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Sản phẩm</h2>
        <div className="stats-grid">
          <div className="stat-card products-card">
            <h3>Tổng sản phẩm</h3>
            <p className="stat-value">{stats.products.total}</p>
          </div>
          <div className="stat-card warning-card">
            <h3>Sắp hết hàng</h3>
            <p className="stat-value">{stats.products.lowStock}</p>
          </div>
          <div className="stat-card danger-card">
            <h3>Hết hàng</h3>
            <p className="stat-value">{stats.products.outOfStock}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function getStatusLabel(status) {
  const statusLabels = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
  };
  return statusLabels[status] || status;
}
