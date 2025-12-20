import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthorPopUp from "./AuthorPopUp";

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  // Trạng thái để mở/đóng AuthorPopUp
  const [showAuthorPopup, setShowAuthorPopup] = useState(false);
  // Trạng thái lưu tác giả đang chỉnh sửa (nếu là null thì ở chế độ thêm mới)
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
    <div>
      <h1>Danh sách tác giả</h1>

      {/* Nút mở popup thêm tác giả mới */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => {
            setEditingAuthor(null);
            setShowAuthorPopup(true);
          }}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Thêm tác giả
        </button>
      </div>

      {/* Popup thêm/chỉnh sửa tác giả */}
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

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Lỗi: {typeof error === "string" ? error : JSON.stringify(error)}</p>
      ) : authors.length === 0 ? (
        <p>Chưa có tác giả.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8, width: 60 }}>STT</th>
              <th style={{ textAlign: "left", padding: 8, width: '20%' }}>Tên tác giả</th>
              <th style={{ textAlign: "left", padding: 8, width: '22%' }}>Tiểu sử</th>
              <th style={{ textAlign: "left", padding: 8 }}>Quốc tịch</th>
              <th style={{ textAlign: "left", padding: 8 }}>Ngày sinh</th>
              <th style={{ textAlign: "left", padding: 8 }}>Tổng sách</th>
              <th style={{ textAlign: "left", padding: 8 }}>Followers</th>
              <th style={{ textAlign: "left", padding: 8, width: 160 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((a, idx) => (
              <tr key={a._id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: 8, verticalAlign: 'top' }}>{idx + 1}</td>
                <td style={{ padding: 8, verticalAlign: 'top' }}>{a.name}</td>
                <td style={{ padding: 8, verticalAlign: 'top', color: '#444' }}>{(a.biography || a.bio || '').length > 120 ? (a.biography || a.bio || '').slice(0, 120) + '...' : (a.biography || a.bio || '')}</td>
                <td style={{ padding: 8, verticalAlign: 'top' }}>{a.nationality || ''}</td>
                <td style={{ padding: 8, verticalAlign: 'top' }}>{a.dateOfBirth ? (new Date(a.dateOfBirth).toISOString().split('T')[0]) : ''}</td>
                <td style={{ padding: 8, verticalAlign: 'top' }}>{typeof a.totalBooks === 'number' ? a.totalBooks : (a.totalBooks || 0)}</td>
                <td style={{ padding: 8, verticalAlign: 'top' }}>{typeof a.followers === 'number' ? a.followers.toLocaleString() : (a.followers ? Number(a.followers).toLocaleString() : '0')}</td>
                <td style={{ padding: 8, verticalAlign: 'top' }}>
                  <button
                    onClick={() => {
                      setEditingAuthor(a);
                      setShowAuthorPopup(true);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    Sửa
                  </button>
                  <button
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
