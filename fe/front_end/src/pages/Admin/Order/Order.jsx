import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Order.css"; 

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null); 

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:8080/api/orders/admin/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.status === "success") {
        setOrders(res.data.data.orders || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Bạn có chắc muốn chuyển trạng thái đơn hàng thành "${newStatus}"?`)) return;

    setUpdatingId(orderId);
    try {
      const res = await axios.patch(
        `http://localhost:8080/api/orders/admin/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === "success") {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? res.data.data.order : order
          )
        );
      }
    } catch (err) {
      alert("Cập nhật thất bại: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const formatVND = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f39c12"; // Cam
      case "processing":
        return "#3498db"; // Xanh dương
      case "shipped":
        return "#9b59b6"; // Tím
      case "delivered":
        return "#27ae60"; // Xanh lá
      case "cancelled":
        return "#e74c3c"; // Đỏ
      default:
        return "#7f8c8d";
    }
  };

  if (loading) return <div className="orders-loading">Đang tải đơn hàng...</div>;
  if (error) return <div className="orders-error">{error}</div>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">Quản lý đơn hàng</h1>

      {orders.length === 0 ? (
        <div className="orders-empty">Chưa có đơn hàng nào.</div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Số sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Phương thức TT</th>
              <th>Trạng thái TT</th>
              <th>Trạng thái đơn</th>
              <th>Ngày đặt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.slice(-8)}</td>
                <td>
                  <div>
                    <strong>{order.user?.name || "Khách lẻ"}</strong>
                    <br />
                    <small>{order.user?.email || "-"}</small>
                  </div>
                </td>
                <td>{order.items?.length || 0}</td>
                <td className="money">{formatVND(order.totalAmount)}</td>
                <td>{order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : order.paymentMethod}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor:
                        order.paymentStatus === "paid" ? "#27ae60" : "#e67e22",
                    }}
                  >
                    {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                </td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status === "pending" && "Chờ xác nhận"}
                    {order.status === "processing" && "Đang xử lý"}
                    {order.status === "shipped" && "Đang giao"}
                    {order.status === "delivered" && "Đã giao"}
                    {order.status === "cancelled" && "Đã hủy"}
                  </span>
                </td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    disabled={updatingId === order._id}
                    className="status-select"
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Hủy đơn</option>
                  </select>
                  {updatingId === order._id && <small> Đang cập nhật...</small>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}