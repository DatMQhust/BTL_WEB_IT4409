import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { useOrderService } from "../../services/useOrderService";

import "./OrderDetail.css";

export default function OrderDetail() {
  const { orderId } = useParams(); // Get order ID from URL (App.jsx uses :orderId)
  const { user } = useAuth();
  const { getOrderDetail, loading, error } = useOrderService();
  const [order, setOrder] = useState(null);

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return "delivered";
      case "processing":
        return "processing";
      case "shipped":
        return "shipped";
      case "cancelled":
        return "cancelled";
      case "pending":
      default:
        return "pending";
    }
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "failed":
        return "Thanh toán lỗi";
      case "pending":
      default:
        return "Chờ thanh toán";
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "paid";
      case "failed":
        return "failed";
      case "pending":
      default:
        return "pending";
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (user && orderId) {
        try {
          const response = await getOrderDetail(orderId);

          // Backend returns: { status: 'success', data: { order } }
          // Keep this tolerant to avoid false "not found" if response shape changes.
          const orderData = response?.data?.order || response?.order;
          setOrder(orderData || null);
        } catch (err) {
          console.error("Failed to fetch order details:", err);
          // Handle error display to user
        }
      }
    };
    fetchOrder();
  }, [user, orderId, getOrderDetail]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="order-detail-page">
          <div className="order-detail-container">
            <div className="order-detail-empty">
              <p>Vui lòng đăng nhập để xem chi tiết đơn hàng.</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="order-detail-page">
          <div className="order-detail-container">
            <div className="order-detail-empty">
              <p>Đang tải chi tiết đơn hàng...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="order-detail-page">
          <div className="order-detail-container">
            <div className="order-detail-empty order-detail-empty--error">
              <p>Lỗi khi tải chi tiết đơn hàng: {error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="order-detail-page">
          <div className="order-detail-container">
            <div className="order-detail-empty">
              <p>Không tìm thấy đơn hàng này.</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const createdAt = order.createdAt ? new Date(order.createdAt) : null;
  const orderCode = order.orderCode || (order._id ? order._id.slice(-6) : "");
  const subtotal = (order.items || []).reduce(
    (total, item) => total + (item?.price || 0) * (item?.quantity || 0),
    0
  );
  const vatAmount = 0;
  const shippingFee = 0;

  return (
    <>
      <Navbar />
      <div className="order-detail-page">
        <div className="order-detail-container">
          <div className="order-detail-page-header">
            <h1 className="order-detail-page-title">Đơn hàng của tôi</h1>
            <p className="order-detail-page-subtitle">Chi tiết đơn hàng bạn đã đặt.</p>
          </div>

          <div className="order-detail-card">
            {/* Header */}
            <div className="order-detail-header">
              <div className="order-detail-meta">
                <div className="order-detail-meta-row">
                  <span className="order-detail-meta-label">Mã đơn hàng</span>
                  <span className="order-detail-meta-value">#{orderCode}</span>
                </div>
                <div className="order-detail-meta-row">
                  <span className="order-detail-meta-label">Ngày đặt</span>
                  <span className="order-detail-meta-value">
                    {createdAt ? createdAt.toLocaleDateString("vi-VN") : ""}
                  </span>
                </div>
              </div>

              <div className="order-detail-badges">
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {getOrderStatusText(order.status)}
                </span>
              </div>
            </div>

            {/* Product list */}
            <div className="order-detail-section">

              {order.items && order.items.length > 0 ? (
                <div className="order-item-list">
                  {order.items.map((item) => (
                    <div
                      key={item.product?._id || item.product || item._id}
                      className="order-item-row"
                    >
                      <div className="order-item-left">
                        <img
                          src={item.product?.coverImageUrl || "/default-book.png"}
                          alt={item.product?.name || item.name}
                          className="order-item-thumb"
                        />
                        <div className="order-item-info">
                          <p className="order-item-name">{item.product?.name || item.name}</p>
                          <p className="order-item-meta">
                            {item.quantity} x {(item.price || 0).toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                      </div>

                      <div className="order-item-total">
                        {((item.quantity || 0) * (item.price || 0)).toLocaleString("vi-VN")}₫
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="order-detail-muted">Không có sản phẩm nào trong đơn hàng này.</p>
              )}
            </div>

            {/* Information grid */}
            <div className="order-detail-section">
              <div className="order-info-grid">
                {/* Column 1: Shipping */}
                <div className="order-info-col">
                  <h3 className="order-info-title">Thông tin giao hàng</h3>

                  {order.shippingAddress ? (
                    <div className="order-info-list">
                      <div className="order-info-row">
                        <span className="order-info-label">Người nhận</span>
                        <span className="order-info-value">{order.shippingAddress.fullName}</span>
                      </div>
                      <div className="order-info-row">
                        <span className="order-info-label">Số điện thoại</span>
                        <span className="order-info-value">{order.shippingAddress.phone}</span>
                      </div>
                      <div className="order-info-row">
                        <span className="order-info-label">Địa chỉ</span>
                        <span className="order-info-value">{order.shippingAddress.address}</span>
                      </div>
                      <div className="order-info-row">
                        <span className="order-info-label">Thành phố</span>
                        <span className="order-info-value">{order.shippingAddress.city}</span>
                      </div>
                      <div className="order-info-row">
                        <span className="order-info-label">Mã bưu chính</span>
                        <span className="order-info-value">{order.shippingAddress.postalCode}</span>
                      </div>
                      <div className="order-info-row">
                        <span className="order-info-label">Quốc gia</span>
                        <span className="order-info-value">{order.shippingAddress.country}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="order-detail-muted">Không có thông tin địa chỉ giao hàng.</p>
                  )}
                </div>

                {/* Column 2: Payment */}
                <div className="order-info-col">
                  <h3 className="order-info-title">Thông tin thanh toán</h3>

                  <div className="order-info-list">
                    <div className="order-info-row">
                      <span className="order-info-label">Trạng thái</span>
                      <span
                        className={`status-badge payment-badge ${getPaymentStatusClass(
                          order.paymentStatus
                        )}`}
                      >
                        {getPaymentStatusText(order.paymentStatus)}
                      </span>
                    </div>
                    <div className="order-info-row">
                      <span className="order-info-label">Phương thức</span>
                      <span className="order-info-value">{order.paymentMethod}</span>
                    </div>
                    {order.user && (
                      <>
                        <div className="order-info-row">
                          <span className="order-info-label">Người đặt</span>
                          <span className="order-info-value">{order.user.name}</span>
                        </div>
                        <div className="order-info-row">
                          <span className="order-info-label">Email</span>
                          <span className="order-info-value">{order.user.email}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Column 3: Summary */}
                <div className="order-summary">
                  <h3 className="order-info-title">Tổng quan đơn hàng</h3>

                  <div className="order-summary-row">
                    <span>Tạm tính</span>
                    <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="order-summary-row">
                    <span>VAT</span>
                    <span>{vatAmount.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="order-summary-row">
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}₫`}</span>
                  </div>
                  <div className="order-summary-row order-summary-row--grand">
                    <span>Tổng cộng</span>
                    <span>{(order.totalAmount || 0).toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="order-detail-footer">
              <div className="order-detail-actions">
                <button type="button" className="btn-primary-solid">
                  Thanh toán lại
                </button>
                <button type="button" className="btn-danger-solid">
                  Hủy đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
