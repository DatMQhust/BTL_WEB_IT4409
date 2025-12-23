import { useEffect, useState } from "react";
import "./Revenue.css";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const Revenue = () => {
  const token = localStorage.getItem("token");

  const [period, setPeriod] = useState("month");

  const [bestSelling, setBestSelling] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [revenueStats, setRevenueStats] = useState([]);

  const [loading, setLoading] = useState(true);

  const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        /* ===== BIỂU ĐỒ DOANH THU ===== */
        const revenueRes = await fetch(
          `http://localhost:8080/api/admin/revenue?period=${period}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const revenueJson = await revenueRes.json();
        if (revenueRes.ok) {
          setRevenueStats(revenueJson.data?.stats?.data || []);
        }

        /* ===== BEST SELLING ===== */
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

        /* ===== SALES BY CATEGORY ===== */
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

  /* ===== DỮ LIỆU BIỂU ĐỒ ===== */
  const revenueChartData = {
    labels: revenueStats.map((item) => {
      if (period === "year") return `Tháng ${item.period}`;
      if (period === "month") return `Ngày ${item.period}`;
      if (period === "week") return `Ngày ${item.period}`;
      return item.period;
    }),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: revenueStats.map((item) => item.revenue),
      },
    ],
  };

  if (loading) {
    return <p className="loading-text">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="revenue-container">
      <h1 className="revenue-title">📊 Trang Doanh Thu</h1>

      {/* ===== FILTER ===== */}
      <div className="filter-bar">
        <label>Khoảng thời gian:</label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="week">Tuần</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>
      </div>

      {/* ===== BIỂU ĐỒ DOANH THU ===== */}
      <section className="revenue-chart-section">
        <h2>📈 Tổng doanh thu theo thời gian</h2>

        {revenueStats.length > 0 ? (
          <Bar
            data={revenueChartData}
            options={{
              responsive: true,
              fill:"#6ec1ff",
              plugins: {
                legend: { display: true },
                tooltip: {
                  callbacks: {
                    label: (ctx) =>
                      formatVND(ctx.raw),
                  },
                },
              },
              scales: {
                y: {
                  ticks: {
                    callback: (value) =>
                      new Intl.NumberFormat("vi-VN").format(value),
                  },
                },
              },
            }}
          />
        ) : (
          <p>Chưa có dữ liệu doanh thu.</p>
        )}
      </section>

      {/* ===== BEST SELLING ===== */}
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
                  <td className="highlight">
                    {formatVND(p.totalRevenue)}
                  </td>
                  <td>{p.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa có dữ liệu sản phẩm bán chạy.</p>
        )}
      </section>

      {/* ===== SALES BY CATEGORY ===== */}
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
