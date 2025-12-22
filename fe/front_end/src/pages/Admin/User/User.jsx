import React, { useEffect, useState } from "react";
import axios from "axios";
import "./User.css";

export default function User() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomersStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:8080/api/admin/customers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.status === "success") {
          setStats(res.data.data.stats);
        } else {
          setError("Không thể tải dữ liệu khách hàng");
        }
      } catch (err) {
        console.error(err);
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomersStats();
  }, []);

  const formatVND = (amount = 0) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);

  if (loading) return <div className="user-loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="user-error">{error}</div>;

  return (
    <div className="user-page">
      <h1 className="user-title">Thống kê khách hàng</h1>

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

      {/* Customer Growth - Bảng thay thế biểu đồ */}
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
  );
}