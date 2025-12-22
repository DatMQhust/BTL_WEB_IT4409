import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { createProduct, updateProduct } from "../../../services/product.service";
import { getAllCategories } from "../../../services/category.service";
import "./BookPopUp.css";

export default function BookPopUp({ open, onClose, onSaved, editingBook }) {
  if (!open) return null;

  /* Preview ảnh */
  const [imagePreview, setImagePreview] = useState(
    editingBook?.coverImageUrl || ""
  );

  /* Categories */
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  /* Fetch categories khi mở popup */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getAllCategories();
        if (response.status === "success") {
          setCategories(response.data?.categories || []);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  /* Giá trị ban đầu */
  const initialValues = {
    name: editingBook?.name || "",
    slug: editingBook?.slug || "",
    price: editingBook?.price ?? 0,
    discount: editingBook?.discount ?? 0,
    description: editingBook?.description || "",
    categoryId: editingBook?.categoryId?._id || editingBook?.categoryId || "",
    authors: Array.isArray(editingBook?.authors)
      ? editingBook.authors
          .map(a => (typeof a === "object" ? a.name : a))
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
    price: yup.number().required("Giá bắt buộc"),
    inStock: yup.number().required("Tồn kho bắt buộc"),
    categoryId: yup.string().required("Danh mục bắt buộc"),
  });

  /* Upload ảnh */
  const handleImageUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFieldValue("coverImageUrl", reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* Submit */
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const authorsPayload = values.authors
        .split("\n")
        .map(a => a.trim())
        .filter(Boolean)
        .map(name => ({ name }));

      const payload = {
        ...values,
        authors: authorsPayload,
      };

      if (!payload.slug && payload.name) {
        payload.slug = payload.name.toLowerCase().replace(/\s+/g, "-");
      }

      let response;
      if (editingBook) {
        response = await updateProduct(editingBook._id, payload);
        // Response từ update có thêm categories, cập nhật state nếu cần
        if (response.status === "success" && response.data?.categories) {
          setCategories(response.data.categories);
        }
      } else {
        response = await createProduct(payload);
      }

      onSaved(response.data);
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi khi lưu sách");
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
          {({ isSubmitting, setFieldValue }) => (
            <Form className="bp-grid">

              <div className="bp-group">
                <label>Tên sách *</label>
                <Field name="name" />
                <ErrorMessage name="name" className="bp-error" component="div" />
              </div>

              <div className="bp-group">
                <label>Slug</label>
                <Field name="slug" />
              </div>

              <div className="bp-group">
                <label>Giá *</label>
                <Field name="price" type="number" />
              </div>

              <div className="bp-group">
                <label>Tồn kho *</label>
                <Field name="inStock" type="number" />
              </div>

              <div className="bp-group">
                <label>Danh mục *</label>
                {loadingCategories ? (
                  <div className="bp-loading-select">Đang tải danh mục...</div>
                ) : (
                  <Field as="select" name="categoryId">
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </Field>
                )}
                <ErrorMessage name="categoryId" className="bp-error" component="div" />
              </div>

              <div className="bp-group">
                <label>Tác giả (mỗi dòng một tên)</label>
                <Field as="textarea" name="authors" rows="4" />
              </div>

              <div className="bp-group bp-full">
                <label>Ảnh bìa</label>

                {imagePreview && (
                  <div className="bp-image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="bp-remove-image"
                      onClick={() => {
                        setImagePreview("");
                        setFieldValue("coverImageUrl", "");
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setFieldValue)}
                />

                <Field
                  name="coverImageUrl"
                  placeholder="Hoặc dán URL ảnh"
                  onChange={(e) => {
                    setImagePreview(e.target.value);
                    setFieldValue("coverImageUrl", e.target.value);
                  }}
                />
              </div>

              <div className="bp-group bp-full">
                <label>Mô tả</label>
                <Field as="textarea" name="description" rows="4" />
              </div>

              <div className="bp-actions bp-full">
                <button type="button" onClick={onClose}>Hủy</button>
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
