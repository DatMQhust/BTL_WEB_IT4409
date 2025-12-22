import React, { useState } from 'react';
import './AuthorPopUp.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { X } from 'lucide-react';
import axios from 'axios';

export default function AuthorPopUp({ open = true, onClose = () => {}, onSaved = () => {}, editingAuthor = null }) {
	const [notification, setNotification] = useState({ show: false, message: '', isError: true });
	const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
	// Token đọc từ localStorage để đính kèm header Authorization khi có
	const token = localStorage.getItem('token');
	const showNotification = (message, isError = true) => {
		setNotification({ show: true, message, isError });
		setTimeout(() => setNotification({ show: false, message: '', isError: false }), 3000);
	};

	if (!open) return null;

	// Xử lý submit form
	const handleSubmit = async (values, { setSubmitting, resetForm }) => {
		setNotification({ show: false, message: '', isError: true });
		try {
			const headers = token ? { Authorization: `Bearer ${token}` } : {};
			let res;
			if (editingAuthor?._id) {
				// chỉnh sửa: gọi PUT /author/:id
				res = await axios.put(`${apiUrl}/author/${editingAuthor._id}`, values, { headers });
				showNotification('Cập nhật tác giả thành công.', false);
			} else {
				// tạo : gọi POST /author
				res = await axios.post(`${apiUrl}/author`, values, { headers });
				showNotification('Thêm tác giả thành công.', false);
			}
			resetForm();
			onSaved(res.data);
			onClose();
		} catch (err) {
			const message = err?.response?.data?.message || err.message || 'Lỗi khi lưu tác giả.';
			showNotification(message, true);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="ap-overlay">
			<div className="ap-content">
				{/* Nút đóng ở góc trên bên phải */}
				<button className="ap-close" onClick={onClose} aria-label="Close">
					<X size={18} />
				</button>
				{/* Tiêu đề thay đổi tùy theo chế độ (thêm mới hay chỉnh sửa) */}
				<h3>{editingAuthor?._id ? 'Chỉnh sửa tác giả' : 'Thêm tác giả mới'}</h3>

				<Formik
					initialValues={{
						name: editingAuthor?.name || '',
						nationality: editingAuthor?.nationality || '',
						dateOfBirth: editingAuthor?.dateOfBirth ? editingAuthor.dateOfBirth.split('T')[0] : '',
						slug: editingAuthor?.slug || '',
						biography: editingAuthor?.biography || '',
					}}
					validationSchema={yup.object({
						// Tên bắt buộc khi tạo tác giả
						name: yup.string().required('Vui lòng nhập tên tác giả'),
						// Các field tùy chọn 
						nationality: yup.string().nullable(),
						dateOfBirth: yup.date().nullable().typeError('Ngày sinh phải là định dạng ngày'),
						biography: yup.string().nullable(),
						slug: yup.string().nullable(),
					})}
					onSubmit={handleSubmit}
				>
					{({ isSubmitting }) => (
						<Form className="ap-form">
							<div className="ap-group">
								<label htmlFor="name">Tên tác giả</label>
								<Field id="name" name="name" className="ap-input" />
								<ErrorMessage name="name" component="div" className="ap-error" />
							</div>

							{editingAuthor?._id && (
								<div className="ap-group">
									<label>ID tác giả</label>
									<input
									type="text"
									value={editingAuthor._id}
									className="ap-input ap-readonly"
									disabled
									/>
								</div>
								)}

							<div className="ap-group">
								<label htmlFor="nationality">Quốc tịch (tùy chọn)</label>
								<Field id="nationality" name="nationality" className="ap-input" />
								<ErrorMessage name="nationality" component="div" className="ap-error" />
							</div>

							<div className="ap-group">
								<label htmlFor="dateOfBirth">Ngày sinh (tùy chọn)</label>
								<Field id="dateOfBirth" name="dateOfBirth" type="date" className="ap-input" />
								<ErrorMessage name="dateOfBirth" component="div" className="ap-error" />
							</div>

							<div className="ap-group">
								<label htmlFor="slug">Slug (tùy chọn)</label>
								<Field id="slug" name="slug" className="ap-input" />
								<ErrorMessage name="slug" component="div" className="ap-error" />
							</div>

							<div className="ap-group">
								<label htmlFor="biography">Tiểu sử (tùy chọn)</label>
								<Field as="textarea" id="biography" name="biography" className="ap-textarea" />
								<ErrorMessage name="biography" component="div" className="ap-error" />
							</div>

							{/* Khu vực hiển thị thông báo (thành công/lỗi) */}
							{notification.show && (
								<div className={`ap-notify ${notification.isError ? 'error' : 'success'}`}>
									{notification.message}
								</div>
							)}

							<div className="ap-actions">
								<button type="button" className="ap-btn ap-btn-cancel" onClick={onClose} disabled={isSubmitting}>
									Hủy
								</button>
								<button type="submit" className="ap-btn ap-btn-primary" disabled={isSubmitting}>
									{isSubmitting ? 'Đang lưu...' : editingAuthor?._id ? 'Cập nhật' : 'Lưu'}
								</button>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
}