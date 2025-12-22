import { useEffect, useState } from "react";
import "./Revenue.css";

const Revenue = () => {
  const token = localStorage.getItem("token");

  const [period, setPeriod] = useState("all");
  const [bestSelling, setBestSelling] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================== HELPERS ================== */
  const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  /* ================== FETCH ================== */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        /* Best selling */
        const bestRes = await fetch(
          `http://localhost:8080/api/admin/best-selling?period=${period}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const bestJson = await bestRes.json();
        if (bestRes.ok) {
          setBestSelling(bestJson.data?.products || []);
        }

        /* Sales by category */
        const cateRes = await fetch(
          `http://localhost:8080/api/admin/sales-by-category?period=${period}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const cateJson = await cateRes.json();
        if (cateRes.ok) {
          setSalesByCategory(cateJson.data?.sales || []);
        }
      } catch (err) {
        console.error("Lỗi load doanh thu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [period, token]);

  /* ================== RENDER ================== */
  if (loading) {
    return <p className="loading-text">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="revenue-container">
      <h1 className="revenue-title">📊 Trang Doanh Thu</h1>

      {/* Bộ lọc */}
      <div className="filter-bar">
        <label>Khoảng thời gian:</label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>
      </div>

      {/* Best Selling */}
      <section className="best-selling-section">
        <h2>🔥 Sản phẩm bán chạy nhất</h2>
        {bestSelling.length > 0 ? (
          <table className="revenue-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Đã bán</th>
                <th>Doanh thu</th>
                <th>Số đơn</th>
              </tr>
            </thead>
            <tbody>
              {bestSelling.map((p) => (
                <tr key={p.productId}>
                  <td className="product-cell">
                    <img src={p.coverImageUrl} alt={p.name} />
                    <span>{p.name}</span>
                  </td>
                  <td>{formatVND(p.price)}</td>
                  <td>{p.totalSold}</td>
                  <td className="highlight">{formatVND(p.totalRevenue)}</td>
                  <td>{p.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa có dữ liệu sản phẩm bán chạy.</p>
        )}
      </section>

      {/* Sales by Category */}
      <section className="category-sales-section">
        <h2>📚 Doanh thu theo danh mục</h2>
        {salesByCategory.length > 0 ? (
          <table className="revenue-table">
            <thead>
              <tr>
                <th>Danh mục</th>
                <th>Đã bán</th>
                <th>Số đơn</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {salesByCategory.map((c) => (
                <tr key={c.categoryId}>
                  <td>{c.categoryName}</td>
                  <td>{c.totalSold}</td>
                  <td>{c.orderCount}</td>
                  <td className="highlight">
                    {formatVND(c.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa có dữ liệu doanh thu theo danh mục.</p>
        )}
      </section>
    </div>
  );
};

export default Revenue;