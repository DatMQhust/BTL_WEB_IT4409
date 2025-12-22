import React from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import "./BookPopUp.css";

export default function BookPopUp({ open, onClose, onSaved, editingBook }) {
  if (!open) return null;

  const token = localStorage.getItem("token");
  const apiUrl = "http://localhost:8080/api/product";

  /* Khởi tạo giá trị ban đầu */
  const initialValues = {
    name: editingBook?.name || "",
    slug: editingBook?.slug || "",
    price: editingBook?.price ?? 0,
    discount: editingBook?.discount ?? 0,
    description: editingBook?.description || "",
    categoryId: editingBook?.categoryId?._id || editingBook?.categoryId || "",
    // Khi edit: lấy tên tác giả, mỗi tên một dòng
    authors: Array.isArray(editingBook?.authors)
      ? editingBook.authors
          .map(a => (typeof a === "object" && a.name ? a.name : a))
          .filter(Boolean)
          .join("\n")
      : "",
    publisher: editingBook?.publisher || "",
    isbn: editingBook?.isbn || "",
    coverImageUrl: editingBook?.coverImageUrl || "",
    rating: editingBook?.rating ?? 0,
    inStock: editingBook?.inStock ?? 0,
    sold: editingBook?.sold ?? 0,
  };

  /* Validation */
  const validationSchema = yup.object({
    name: yup.string().required("Tên sách bắt buộc"),
    price: yup.number().typeError("Giá phải là số").required("Giá bắt buộc"),
    inStock: yup.number().typeError("Tồn kho phải là số").required("Tồn kho bắt buộc"),
    categoryId: yup.string().required("Danh mục bắt buộc"),
    authors: yup.string(), 
  });

  /* Xử lý submit form */
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Xử lý authors: chuyển từ chuỗi (mỗi dòng một tên) → mảng object [{ name: "..." }]
      // Luôn đảm bảo authors là mảng object { name: string }
      const authorsPayload = typeof values.authors === "string"
        ? values.authors
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "")
            .map(name => ({ name }))
        : [];

      // Tạo payload gửi lên server
      const payload = {
        ...values,
        authors: authorsPayload, 
        categoryId: values.categoryId || undefined,
      };

      // Nếu không có slug, để backend tự tạo từ name
      if (!payload.slug && payload.name) {
        payload.slug = payload.name.toLowerCase().replace(/\s+/g, "-");
      }

      let response;
      if (editingBook) {
        response = await axios.put(`${apiUrl}/${editingBook._id}`, payload, { headers });
      } else {
        response = await axios.post(apiUrl, payload, { headers });
      }

      onSaved(response.data); 
      onClose();
    } catch (err) {
      console.error("Lỗi khi lưu sách:", err.response?.data);
      alert(err?.response?.data?.message || "Lỗi khi lưu sách. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bp-overlay">
      <div className="bp-content">
        <h2>{editingBook ? "Sửa sách" : "Thêm sách mới"}</h2>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="bp-grid">
              {/* Cột trái */}
              <div className="bp-group">
                <label>Tên sách *</label>
                <Field name="name" placeholder="Nhập tên sách" />
                <ErrorMessage name="name" component="div" className="bp-error" />
              </div>

              <div className="bp-group">
                <label>Slug (tùy chọn)</label>
                <Field name="slug" placeholder="Tự động tạo nếu để trống" />
              </div>

              <div className="bp-group">
                <label>Giá *</label>
                <Field name="price" type="number" />
                <ErrorMessage name="price" component="div" className="bp-error" />
              </div>

              <div className="bp-group">
                <label>Giảm giá (%)</label>
                <Field name="discount" type="number" min="0" max="100" />
              </div>

              <div className="bp-group">
                <label>Danh mục (categoryId) *</label>
                <Field name="categoryId" placeholder="Nhập ID danh mục" />
                <ErrorMessage name="categoryId" component="div" className="bp-error" />
              </div>

              <div className="bp-group">
                <label>Tác giả (mỗi dòng một tên)</label>
                <Field
                  as="textarea"
                  name="authors"
                  rows="4"
                  placeholder="Nguyễn Nhật Ánh&#10;Tô Hoài&#10;Nam Cao"
                />
                <small style={{ color: "#666" }}>
                  Nhập mỗi tác giả một dòng. Hệ thống sẽ tự tạo nếu chưa tồn tại.
                </small>
              </div>

              <div className="bp-group">
                <label>Nhà xuất bản</label>
                <Field name="publisher" />
              </div>

              <div className="bp-group">
                <label>ISBN</label>
                <Field name="isbn" />
              </div>

              <div className="bp-group">
                <label>Ảnh bìa (URL)</label>
                <Field name="coverImageUrl" placeholder="https://..." />
              </div>

              <div className="bp-group">
                <label>Rating (sao)</label>
                <Field name="rating" type="number" min="0" max="5" step="0.1" />
              </div>

              <div className="bp-group">
                <label>Tồn kho *</label>
                <Field name="inStock" type="number" />
                <ErrorMessage name="inStock" component="div" className="bp-error" />
              </div>

              <div className="bp-group">
                <label>Đã bán</label>
                <Field name="sold" type="number" />
              </div>

              <div className="bp-group bp-full">
                <label>Mô tả</label>
                <Field as="textarea" name="description" rows="5" />
              </div>

              <div className="bp-actions bp-full">
                <button type="button" onClick={onClose}>
                  Hủy
                </button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}