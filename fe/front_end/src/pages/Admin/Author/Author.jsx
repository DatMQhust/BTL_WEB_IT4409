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

  const token = localStorage.getItem("token");

  const fetchAuthors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:8080/api/author", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = res.data?.data?.authors || res.data?.authors || res.data;
      setAuthors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data || err.message || "Lỗi khi lấy tác giả");
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return (
    <div className="authors-container">
      <h1 className="authors-title">Danh sách tác giả</h1>

      {/* Nút thêm tác giả */}
      <button
        className="add-author-btn"
        onClick={() => {
          setEditingAuthor(null);
          setShowAuthorPopup(true);
        }}
      >
        + Thêm tác giả
      </button>

      {/* Popup thêm/chỉnh sửa */}
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
          fetchAuthors();
        }}
      />

      {/* Loading */}
      {loading && <div className="authors-loading">Đang tải...</div>}

      {/* Error */}
      {error && (
        <div className="authors-error">
          Lỗi: {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && authors.length === 0 && (
        <div className="authors-empty">Chưa có tác giả.</div>
      )}

      {/* Danh sách tác giả - Bảng */}
      {!loading && !error && authors.length > 0 && (
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
                <td>{idx + 1}</td>
                <td>{a.name}</td>
                <td className="bio-cell">
                  {(a.biography || a.bio || "").length > 120
                    ? (a.biography || a.bio || "").slice(0, 120) + "..."
                    : a.biography || a.bio || ""}
                </td>
                <td>{a.nationality || ""}</td>
                <td>
                  {a.dateOfBirth
                    ? new Date(a.dateOfBirth).toISOString().split("T")[0]
                    : ""}
                </td>
                <td>
                  {typeof a.totalBooks === "number" ? a.totalBooks : a.totalBooks || 0}
                </td>
                <td>
                  {typeof a.followers === "number"
                    ? a.followers.toLocaleString()
                    : a.followers
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
                      onClick={async () => {
                        if (!confirm("Bạn có chắc muốn xóa tác giả này?")) return;
                        try {
                          const headers = token ? { Authorization: `Bearer ${token}` } : {};
                          await axios.delete(`http://localhost:8080/api/author/${a._id}`, { headers });
                          await fetchAuthors();
                        } catch (err) {
                          setError(err?.response?.data || err.message || "Lỗi khi xóa tác giả");
                        }
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}