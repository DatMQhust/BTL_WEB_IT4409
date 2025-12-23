import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import BookPopUp from "./BookPopUp";
import { getAllProducts, deleteProduct } from "../../../services/product.service";
import "./Book.css";

export default function Books() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!user) {
      alert("Vui lòng đăng nhập để truy cập trang này!");
      navigate("/");
      return;
    }
    if (user.role !== "admin") {
      alert("Bạn không có quyền truy cập trang này!");
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Bộ lọc (chỉ tìm kiếm khi ấn Áp dụng)
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("");
  const [inStock, setInStock] = useState("");

  // Popup
  const [showBookPopup, setShowBookPopup] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Hàm fetch chung 
  const fetchBooks = async (page = 1, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
        ...filters, // chỉ thêm các filter nếu có
      };

      const res = await getAllProducts(params);

      const products = res.data?.products || [];
      const pagination = res.data?.pagination || {};

      setBooks(products);
      setTotalPages(pagination.totalPages || 1);
      setCurrentPage(pagination.page || 1);

    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi khi tải danh sách sách");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchBooks(1, {}); 
  }, []);

  // Xử lý khi ấn nút "Áp dụng"
  const handleApplyFilters = () => {
    const filters = {};
    if (search) filters.search = search;
    if (categoryId) filters.categoryId = categoryId;
    if (authorId) filters.authorId = authorId;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (minRating) filters.minRating = minRating;
    if (sort) filters.sort = sort;
    if (inStock) filters.inStock = inStock;

    setCurrentPage(1); 
    fetchBooks(1, filters);
  };

  // Phân trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      const currentFilters = {};
      if (search) currentFilters.search = search;
      if (categoryId) currentFilters.categoryId = categoryId;
      if (authorId) currentFilters.authorId = authorId;
      if (minPrice) currentFilters.minPrice = minPrice;
      if (maxPrice) currentFilters.maxPrice = maxPrice;
      if (minRating) currentFilters.minRating = minRating;
      if (sort) currentFilters.sort = sort;
      if (inStock) currentFilters.inStock = inStock;

      fetchBooks(newPage, currentFilters);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaved = () => {
    setShowBookPopup(false);
    setEditingBook(null);
    handleApplyFilters();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sách này?")) return;
    try {
      await deleteProduct(id);
      alert("Xóa thành công!");
      handleApplyFilters(); 
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi khi xóa sách");
    }
  };

  return (
    <div className="books-container">
      <h1 className="books-title">Quản lý sách</h1>

      <button
        className="btn-add-book"
        onClick={() => {
          setEditingBook(null);
          setShowBookPopup(true);
        }}
      >
        + Thêm sách mới
      </button>

      {/* Bộ lọc + Nút Áp dụng */}
      <div className="filters-section">
        <div className="filters-grid">
          <input
            type="text"
            placeholder="Tìm tên, mô tả, ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category ID"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author ID"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
          />
          <input
            type="number"
            placeholder="Giá từ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Giá đến"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
            <option value="">Tất cả rating</option>
            <option value="4">≥ 4 sao</option>
            <option value="3">≥ 3 sao</option>
            <option value="2">≥ 2 sao</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Mới nhất</option>
            <option value="price_asc">Giá: thấp → cao</option>
            <option value="price_desc">Giá: cao → thấp</option>
            <option value="rating">Rating cao</option>
            <option value="bestseller">Bán chạy nhất</option>
            <option value="name">Tên A → Z</option>
          </select>
          <select value={inStock} onChange={(e) => setInStock(e.target.value)}>
            <option value="">Tất cả kho</option>
            <option value="true">Chỉ còn hàng</option>
          </select>
        </div>

        {/* Nút Áp dụng */}
        <div className="apply-button-container">
          <button className="btn-apply" onClick={handleApplyFilters}>
            Áp dụng
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
          <table className="books-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sách</th>
                <th>Thể loại</th>
                <th>Tác giả</th>
                <th>Giá</th>
                <th>Kho</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    Không tìm thấy sách nào.
                  </td>
                </tr>
              ) : (
                books.map((b, idx) => (
                  <tr key={b._id}>
                    <td>{(currentPage - 1) * 10 + idx + 1}</td>
                    <td className="book-name">{b.name}</td>
                    <td>{b.categoryId?.name || "—"}</td>
                    <td>{b.authors?.map((a) => a.name).join(", ") || "—"}</td>
                    <td>
                      {b.price.toLocaleString()} đ
                      {b.discount > 0 && <span className="discount"> -{b.discount}%</span>}
                    </td>
                    <td>{b.inStock}</td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditingBook(b);
                          setShowBookPopup(true);
                        }}
                      >
                        Sửa
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(b._id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}>
                ← Trước
              </button>
              <span className="page-info">
                Trang {currentPage}/ {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}>
                Sau →
              </button>
            </div>
          )}
        </>
      )}

      <BookPopUp
        open={showBookPopup}
        editingBook={editingBook}
        onClose={() => {
          setShowBookPopup(false);
          setEditingBook(null);
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}