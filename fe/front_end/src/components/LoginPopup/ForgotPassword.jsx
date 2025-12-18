import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { X } from 'lucide-react';
import './LoginPopup.css'; // Tái sử dụng CSS từ LoginPopup
import axios from 'axios';
import ResetPassword from "./ResetPassword"; // Import component ResetPassword

const forgotPasswordSchema = yup.object().shape({
    email: yup.string().email("Email không hợp lệ.").required("Vui lòng nhập email."),
});

const ForgotPassword = ({ resetStates, backToLogin }) => {
    const [notification, setNotification] = useState({ show: false, message: '', isError: true });
    const [view, setView] = useState('forgot'); // 'forgot' hoặc 'reset'

    const showNotification = (message, isError = true) => {
        setNotification({ show: true, message, isError });
        setTimeout(() => setNotification({ show: false, message: '', isError: false }), 3000);
    };

    const handleFormSubmit = async (values, { setSubmitting }) => {
        setNotification({ show: false, message: '', isError: false });

        try {
            // Gọi API để yêu cầu gửi token reset mật khẩu
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${apiUrl}/user/forgot-password`, {
                email: values.email
            }); // Gửi email từ Formik values

            const data = response.data;

            if (data.status === "success") {
                showNotification(data.message, false);
                // Chuyển sang màn hình nhập token và mật khẩu mới
                setTimeout(() => setView('reset'), 1000);
            } else {
                // This case might not be reached if axios throws on non-2xx status
                showNotification(data.message || "Yêu cầu không thành công.", true);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra, vui lòng thử lại.";
            showNotification(errorMessage, true);
        } finally {
            setSubmitting(false);
        }
    };

    // Nếu view là 'reset', hiển thị component ResetPassword
    if (view === 'reset') {
        return <ResetPassword
            resetStates={resetStates}
            backToLogin={backToLogin}
        />;
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content" style={{ maxWidth: '450px' }}>
                <button onClick={resetStates} className="popup-close-btn">
                    <X size={24} />
                </button>

                <Formik
                    initialValues={{ email: "" }}
                    validationSchema={forgotPasswordSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="popup-form">
                            <h2>Quên mật khẩu</h2>

                            <div className="form-group">
                                <label htmlFor="email">Nhập email đã đăng ký</label>
                                <Field type="email" id="email" name="email" className="form-input" />
                                <ErrorMessage name="email" component="div" className="error-message-field" />
                            </div>

                            {notification.show && (
                                <p className={`error-message ${!notification.isError ? 'success-message' : ''}`}>
                                    {notification.message}
                                </p>
                            )}
                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                            </button>
                            <p className="switch-form-text">
                                Đã nhớ mật khẩu?{' '}
                                <span onClick={backToLogin}>
                                    Đăng nhập
                                </span>
                            </p>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ForgotPassword;