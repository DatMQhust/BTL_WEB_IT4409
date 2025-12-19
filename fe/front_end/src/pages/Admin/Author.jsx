import { useEffect, useState } from "react";
import axios from "axios";

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  /* FETCH AUTHORS (GET)*/
  const fetchAuthors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/author");
      setAuthors(res.data.data.authors);
    } catch (error) {
      console.error("Lỗi lấy tác giả:", error);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  /* CRUD AUTHOR*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // UPDATE
        await axios.put(
          `http://localhost:5000/api/author/${editingId}`,
          { name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // CREATE
        await axios.post(
          "http://localhost:5000/api/author",
          { name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setName("");
      setEditingId(null);
      fetchAuthors();
    } catch (error) {
      console.error("Lỗi lưu tác giả:", error);
    }
  };

  /*DELETE AUTHOR*/
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tác giả này?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/author/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAuthors();
    } catch (error) {
      console.error("Lỗi xóa tác giả:", error);
    }
  };

  /*EDIT AUTHOR*/
  const handleEdit = (author) => {
    setName(author.name);
    setEditingId(author._id);
  };

  return (
    <div>
      <h1>Quản lý tác giả</h1>

      {/* FORM ADD / EDIT */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên tác giả"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">
          {editingId ? "Cập nhật" : "Thêm"}
        </button>
      </form>

      {/* LIST AUTHORS */}
      <ul>
        {authors.map((author) => (
          <li key={author._id}>
            {author.name}
            <button onClick={() => handleEdit(author)}>Sửa</button>
            <button onClick={() => handleDelete(author._id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
