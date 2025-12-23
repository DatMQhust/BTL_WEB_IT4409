import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from 'lucide-react';
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { useOrderService } from "../../services/useOrderService";
import "./MyOrders.css"; // Import the new CSS

export default function MyOrders() {
  const { user } = useAuth();
  const { getMyOrders, loading, error } = useOrderService();
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const [shouldRefetch, setShouldRefetch] = useState(false);

  useEffect(() => {
    if (location.state?.orderPlaced) {
      setShouldRefetch(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const response = await getMyOrders();
          setOrders(response.data?.orders || []);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
        } finally {
          setShouldRefetch(false);
        }
      }
    };
    fetchOrders();
  }, [user, getMyOrders, shouldRefetch]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered': return 'delivered';
      case 'completed':
      case 'Completed': return 'completed';
      case 'processing': return 'processing';
      case 'shipped': return 'shipped';
      case 'cancelled': return 'cancelled';
      case 'pending':
      default: return 'pending';
    }
  };

  const renderLoading = () => (
    <div className="my-orders-state">
      <p className="my-orders-state-text">Đang tải đơn hàng...</p>
    </div>
  );

  const renderError = () => (
    <div className="my-orders-state my-orders-state--error">
      <p className="my-orders-state-text">Lỗi khi tải đơn hàng: {error}</p>
    </div>
  );

  const renderNoUser = () => (
    <div className="my-orders-state">
      <p className="my-orders-state-text">Vui lòng đăng nhập để xem đơn hàng của bạn.</p>
    </div>
  );

  const renderNoOrders = () => (
    <div className="my-orders-empty">
      <h2 className="my-orders-empty-title">Bạn chưa có đơn hàng nào</h2>
      <p className="my-orders-empty-subtitle">Tất cả các đơn hàng của bạn sẽ được hiển thị ở đây.</p>
      <Link to="/books" className="my-orders-empty-cta">
        Bắt đầu mua sắm
      </Link>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="my-orders-page">
        <div className="my-orders-container">
          <h1 className="my-orders-title">Đơn hàng của tôi</h1>

          {!user ? renderNoUser() : loading ? renderLoading() : error ? renderError() : (
            orders.length === 0 ? renderNoOrders() : (
              <div className="my-orders-list">
                {orders.map((order) => (
                  <Link to={`/orders/${order._id}`} key={order._id} className="order-card-link">
                    <div className="my-order-card">
                      {/* Left */}
                      <div className="my-order-card-left">
                        <div className="my-order-card-top">
                          <span className="my-order-code">#{order.orderCode || order._id.slice(-6)}</span>
                          <span className={`status-badge ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="my-order-date">
                          Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>

                      {/* Right */}
                      <div className="my-order-card-right">
                        <div className="my-order-total">
                          <span className="my-order-total-label">Tổng cộng</span>
                          <span className="my-order-total-value">
                            {(order.totalAmount || 0).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <ChevronRight className="my-order-chevron" size={22} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}