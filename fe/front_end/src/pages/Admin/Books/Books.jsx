import React, { useEffect, useState } from 'react';
import { getInventoryReport, getBestSellingProducts, getSalesByCategory } from '../../../services/admin.service';
import api from '../../../services/api';
import './Books.css';

export default function Books() {
  const [products, setProducts] = useState([]);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [bestSelling, setBestSelling] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (period) {
      fetchBestSelling();
      fetchSalesByCategory();
    }
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all products
      const productsResponse = await api.get('/product');
      const productsData = productsResponse.data?.data?.products || productsResponse.data?.products || [];
      setProducts(Array.isArray(productsData) ? productsData : []);

      // Fetch categories
      const categoriesResponse = await api.get('/category');
      const categoriesData = categoriesResponse.data?.data?.categories || categoriesResponse.data?.categories || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      // Fetch inventory report
      const inventoryResponse = await getInventoryReport();
      setInventoryReport(inventoryResponse.data.report);

      // Fetch best selling
      await fetchBestSelling();
      
      // Fetch sales by category
      await fetchSalesByCategory();
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBestSelling = async () => {
    try {
      const response = await getBestSellingProducts(10, period);
      setBestSelling(response.data.products || []);
    } catch (err) {
      console.error('Error fetching best selling:', err);
    }
  };

  const fetchSalesByCategory = async () => {
    try {
      const response = await getSalesByCategory(period);
      setSalesByCategory(response.data.sales || []);
    } catch (err) {
      console.error('Error fetching sales by category:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.categoryId?._id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="books-loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="books-error">Lỗi: {error}</div>;
  }

  return (
    <div className="books-container">
      <h1 className="books-title">Quản lý sách</h1>

      {/* Inventory Summary */}
      {inventoryReport && (
        <section className="inventory-summary">
          <h2 className="section-title">Tổng quan kho hàng</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <h3>Tổng giá trị kho</h3>
              <p className="summary-value">{formatCurrency(inventoryReport.totalInventoryValue)}</p>
            </div>
            <div className="summary-card warning">
              <h3>Sắp hết hàng</h3>
              <p className="summary-value">{inventoryReport.lowStockProducts?.length || 0}</p>
            </div>
            <div className="summary-card danger">
              <h3>Hết hàng</h3>
              <p className="summary-value">{inventoryReport.outOfStockProducts?.length || 0}</p>
            </div>
          </div>
        </section>
      )}

      {/* Best Selling Products */}
      {bestSelling.length > 0 && (
        <section className="best-selling-section">
          <div className="section-header">
            <h2 className="section-title">Sách bán chạy</h2>
            <select 
              className="period-select"
              value={period} 
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
          <div className="best-selling-grid">
            {bestSelling.slice(0, 5).map((product, index) => (
              <div key={product.productId} className="best-selling-card">
                <div className="rank">#{index + 1}</div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-stats">
                    <div>
                      <span className="label">Đã bán:</span>
                      <span className="value">{product.totalSold}</span>
                    </div>
                    <div>
                      <span className="label">Doanh thu:</span>
                      <span className="value">{formatCurrency(product.totalRevenue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sales by Category */}
      {salesByCategory.length > 0 && (
        <section className="category-sales-section">
          <h2 className="section-title">Doanh thu theo danh mục</h2>
          <div className="category-sales-grid">
            {salesByCategory.map((category) => (
              <div key={category.categoryId} className="category-card">
                <h3>{category.categoryName}</h3>
                <div className="category-stats">
                  <div>
                    <span className="label">Doanh thu:</span>
                    <span className="value">{formatCurrency(category.totalRevenue)}</span>
                  </div>
                  <div>
                    <span className="label">Đã bán:</span>
                    <span className="value">{category.totalSold} sản phẩm</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products List */}
      <section className="products-list-section">
        <h2 className="section-title">Danh sách sản phẩm</h2>
        
        <div className="products-filters">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="no-data">Không tìm thấy sản phẩm nào</p>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sách</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Đã bán</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td className="product-name">{product.name}</td>
                    <td>{product.categoryId?.name || 'N/A'}</td>
                    <td className="price">{formatCurrency(product.price)}</td>
                    <td className={`stock ${getStockClass(product.inStock)}`}>
                      {product.inStock}
                    </td>
                    <td>{product.sold || 0}</td>
                    <td>
                      <span className={`status-badge ${getStockClass(product.inStock)}`}>
                        {getStockStatus(product.inStock)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Low Stock Alert */}
      {inventoryReport && inventoryReport.lowStockProducts && inventoryReport.lowStockProducts.length > 0 && (
        <section className="alert-section">
          <h2 className="section-title">⚠️ Cảnh báo: Sách sắp hết hàng</h2>
          <div className="alert-list">
            {inventoryReport.lowStockProducts.map(product => (
              <div key={product._id} className="alert-item">
                <span className="product-name">{product.name}</span>
                <span className="stock-info">Còn {product.inStock} cuốn</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function getStockClass(stock) {
  if (stock === 0) return 'out-of-stock';
  if (stock < 10) return 'low-stock';
  return 'in-stock';
}

function getStockStatus(stock) {
  if (stock === 0) return 'Hết hàng';
  if (stock < 10) return 'Sắp hết';
  return 'Còn hàng';
}
