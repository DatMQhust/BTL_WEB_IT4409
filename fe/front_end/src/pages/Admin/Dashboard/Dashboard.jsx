import { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../../services/admin.service";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getDashboardStats();

        if (result.status === "success") {
          setStats(result.data.stats);
        } else {
          setError(result.message || "Không thể tải dữ liệu dashboard.");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API dashboard:", err);
        setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatVND = (amount = 0) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <div className="dashboard-loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Tổng quan Dashboard</h1>

      <div className="stats-grid">
        {/* Doanh thu */}
        <div className="stat-card revenue" onClick={() => navigate("/admin/revenue")}>
          <div className="stat-header">
            <h3>Doanh thu</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-value">{formatVND(stats.revenue.total)}</div>
          <div className="stat-label">Tổng doanh thu</div>
          <div className="stat-details">
            <div><span>Hôm nay</span><strong>{formatVND(stats.revenue.today)}</strong></div>
            <div><span>Tháng này</span><strong>{formatVND(stats.revenue.thisMonth)}</strong></div>
            <div><span>Năm nay</span><strong>{formatVND(stats.revenue.thisYear)}</strong></div>
          </div>
        </div>

        {/* Đơn hàng */}
        <div className="stat-card orders" onClick={() => navigate("/admin/order")}>
          <div className="stat-header">
            <h3>Đơn hàng</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div className="stat-value">{stats.orders.total}</div>
          <div className="stat-label">Tổng đơn hàng</div>
          <div className="stat-details">
            <div><span>Hôm nay</span><strong>{stats.orders.today}</strong></div>
            <div><span>Tháng này</span><strong>{stats.orders.thisMonth}</strong></div>
          </div>
        </div>

        {/* Khách hàng */}
        <div className="stat-card customers" onClick={() => navigate("/admin/user")}>
          <div className="stat-header">
            <h3>Khách hàng</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-value">{stats.customers.total}</div>
          <div className="stat-label">Tổng khách hàng</div>
          <div className="stat-details">
            <div><span>Mới hôm nay</span><strong>+{stats.customers.newToday}</strong></div>
            <div><span>Mới tháng này</span><strong>+{stats.customers.newThisMonth}</strong></div>
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="stat-card products" onClick={() => navigate("/admin/book")}>
          <div className="stat-header">
            <h3>Sản phẩm</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div className="stat-value">{stats.products.total}</div>
          <div className="stat-label">Tổng sản phẩm</div>
          <div className="stat-details">
            <div><span>Cận hết hàng</span><strong>{stats.products.lowStock}</strong></div>
            <div><span>Hết hàng</span><strong className="danger">{stats.products.outOfStock}</strong></div>
          </div>
        </div>
      </div>

      {/* Trạng thái đơn hàng */}
      <section className="order-status-section">
        <h2>Trạng thái đơn hàng</h2>
        <div className="order-status-grid">
          <div className="status-item pending">
            <span className="count">{stats.orders.byStatus.pending}</span>
            <span>Chờ xử lý</span>
          </div>
          <div className="status-item processing">
            <span className="count">{stats.orders.byStatus.processing}</span>
            <span>Đang xử lý</span>
          </div>
          <div className="status-item shipped">
            <span className="count">{stats.orders.byStatus.shipped}</span>
            <span>Đang giao</span>
          </div>
          <div className="status-item delivered">
            <span className="count">{stats.orders.byStatus.delivered}</span>
            <span>Đã giao</span>
          </div>
          <div className="status-item cancelled">
            <span className="count">{stats.orders.byStatus.cancelled}</span>
            <span>Đã hủy</span>
          </div>
        </div>
      </section>
    </div>
  );
}