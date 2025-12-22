import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthorPopUp from "./AuthorPopUp";
import "./Author.css";

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAuthorPopup, setShowAuthorPopup] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const token = localStorage.getItem("token");

  const fetchAuthors = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/author?page=${page}&limit=${limit}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const data = res.data?.data || {};
      const pagination = data.pagination || {};

      setAuthors(data.authors || []);
      setCurrentPage(pagination.page || 1);
      setTotalPages(pagination.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data || err.message || "Lỗi khi lấy tác giả");
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors(1);
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    fetchAuthors(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tác giả này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/author/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchAuthors(currentPage);
    } catch (err) {
      setError(err?.response?.data || err.message || "Lỗi khi xóa tác giả");
    }
  };

  return (
    <div className="authors-container">
      <h1 className="authors-title">Danh sách tác giả</h1>

      <button
        className="add-author-btn"
        onClick={() => {
          setEditingAuthor(null);
          setShowAuthorPopup(true);
        }}
      >
        + Thêm tác giả
      </button>

      <AuthorPopUp
        open={showAuthorPopup}
        editingAuthor={editingAuthor}
        onClose={() => {
          setShowAuthorPopup(false);
          setEditingAuthor(null);
        }}
        onSaved={() => {
          setShowAuthorPopup(false);
          setEditingAuthor(null);
          fetchAuthors(currentPage);
        }}
      />

      {loading && <div className="authors-loading">Đang tải...</div>}

      {error && (
        <div className="authors-error">
          Lỗi: {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

      {!loading && !error && authors.length === 0 && (
        <div className="authors-empty">Chưa có tác giả.</div>
      )}

      {!loading && !error && authors.length > 0 && (
        <>
          <table className="authors-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên tác giả</th>
                <th>Tiểu sử</th>
                <th>Quốc tịch</th>
                <th>Ngày sinh</th>
                <th>Tổng sách</th>
                <th>Followers</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((a, idx) => (
                <tr key={a._id}>
                  <td>{(currentPage - 1) * limit + idx + 1}</td>
                  <td>{a.name}</td>
                  <td className="bio-cell">
                    {(a.biography || "").length > 120
                      ? a.biography.slice(0, 120) + "..."
                      : a.biography || ""}
                  </td>
                  <td>{a.nationality || ""}</td>
                  <td>
                    {a.dateOfBirth
                      ? new Date(a.dateOfBirth).toISOString().split("T")[0]
                      : ""}
                  </td>
                  <td>{a.totalBooks || 0}</td>
                  <td>
                    {a.followers
                      ? Number(a.followers).toLocaleString()
                      : "0"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditingAuthor(a);
                          setShowAuthorPopup(true);
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(a._id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ← Trước
              </button>

              <span className="page-info">
                Trang {currentPage}/{totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
