import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import CategoryPopUp from "./CategoryPopUp";
import { getAllCategories, deleteCategory, } from "../../../services/category.service";
import "./Category.css";

export default function Category() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Hàm fetch danh mục
  const fetchCategories = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
      };

      const res = await getAllCategories(params);

      const cats = res.data?.categories || [];
      const pagination = res.data?.pagination || {};

      setCategories(cats);
      setTotalPages(pagination.totalPages || 1);
      setCurrentPage(pagination.page || 1);
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi khi tải danh sách danh mục");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      fetchCategories(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaved = () => {
    setShowCategoryPopup(false);
    setEditingCategory(null);
    fetchCategories(currentPage);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await deleteCategory(id);
      alert("Xóa danh mục thành công!");
      fetchCategories(currentPage);
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi khi xóa danh mục");
    }
  };

  return (
    <div className="books-container">
      <h1 className="books-title">Quản lý danh mục</h1>

      <button
        className="btn-add-book"
        onClick={() => {
          setEditingCategory(null);
          setShowCategoryPopup(true);
        }}
      >
        + Thêm danh mục mới
      </button>

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
                <th>Tên danh mục</th>
                <th>Slug</th>
                <th>Danh mục cha</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    Không có danh mục nào.
                  </td>
                </tr>
              ) : (
                categories.map((cat, idx) => (
                  <tr key={cat._id}>
                    <td>{(currentPage - 1) * 10 + idx + 1}</td>
                    <td className="book-name">{cat.name}</td>
                    <td>{cat.slug}</td>
                    <td>{cat.parentCategory?.name || "—"}</td>
                    <td className="description-cell">
                      {cat.description || "—"}
                    </td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditingCategory(cat);
                          setShowCategoryPopup(true);
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(cat._id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Trước
              </button>
              <span className="page-info">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}

      <CategoryPopUp
        open={showCategoryPopup}
        editingCategory={editingCategory}
        onClose={() => {
          setShowCategoryPopup(false);
          setEditingCategory(null);
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}