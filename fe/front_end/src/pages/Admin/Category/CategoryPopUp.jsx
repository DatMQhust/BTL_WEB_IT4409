import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { createCategory, updateCategory, getAllCategories, } from "../../../services/category.service";
import "./CategoryPopUp.css";

export default function CategoryPopUp({
  open,
  onClose,
  onSaved,
  editingCategory,
}) {
  if (!open) return null;

  const [parentCategories, setParentCategories] = useState([]);
  const [loadingParents, setLoadingParents] = useState(true);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        setLoadingParents(true);
        const res = await getAllCategories({ limit: 100 });
        setParentCategories(res.data?.categories || []);
      } catch (err) {
        console.error("Lỗi tải danh mục cha:", err);
      } finally {
        setLoadingParents(false);
      }
    };

    if (open) fetchParents();
  }, [open]);

  const initialValues = {
    name: editingCategory?.name || "",
    slug: editingCategory?.slug || "",
    description: editingCategory?.description || "",
    parentCategory: editingCategory?.parentCategory?._id || "",
  };

  const validationSchema = yup.object({
    name: yup.string().required("Tên danh mục là bắt buộc"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        ...values,
        parentCategory: values.parentCategory || null,
      };

      if (!payload.slug && payload.name) {
        payload.slug = payload.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "D")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      let response;
      if (editingCategory) {
        response = await updateCategory(editingCategory._id, payload);
      } else {
        response = await createCategory(payload);
      }

      onSaved(response.data);
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi khi lưu danh mục");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cp-overlay">
      <div className="cp-content">
        <h2>{editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}</h2>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="cp-form">
              <div className="cp-group">
                <label>Tên danh mục *</label>
                <Field name="name" placeholder="Ví dụ: Tiểu thuyết" />
                <ErrorMessage name="name" className="cp-error" component="div" />
              </div>

              <div className="cp-group">
                <label>Slug</label>
                <Field name="slug" placeholder="Tự động tạo nếu để trống" />
              </div>

              <div className="cp-group">
                <label>Danh mục cha</label>
                {loadingParents ? (
                  <div className="cp-loading">Đang tải danh mục...</div>
                ) : (
                  <Field as="select" name="parentCategory">
                    <option value="">-- Không có danh mục cha --</option>
                    {parentCategories
                      .filter((cat) => cat._id !== editingCategory?._id)
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                  </Field>
                )}
              </div>

              <div className="cp-group cp-full">
                <label>Mô tả</label>
                <Field as="textarea" name="description" rows="4" placeholder="Mô tả ngắn về danh mục (tùy chọn)" />
              </div>

              <div className="cp-actions">
                <button type="button" onClick={onClose} className="cp-btn-cancel">
                  Hủy
                </button>
                <button type="submit" disabled={isSubmitting} className="cp-btn-save">
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