import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { X } from 'lucide-react';
import './LoginPopup.css'; // Tái sử dụng CSS chung

const passwordSafeRegExp = /^[^'";<>\\/]*$/;

const resetPasswordSchema = yup.object().shape({
    token: yup.string().required("Vui lòng nhập token."),
    password: yup.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự").matches(passwordSafeRegExp, "Mật khẩu chứa ký tự không hợp lệ").required("Vui lòng nhập mật khẩu mới."),
    passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp').required('Vui lòng xác nhận mật khẩu.'),
});

const ResetPassword = ({ resetStates, backToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', isError: true });

    const showNotification = (message, isError = false) => {
        setNotification({ show: true, message, isError });
        setTimeout(() => setNotification({ show: false, message: '', isError: false }), 3000);
    };

    const handleFormSubmit = async (values, { setSubmitting }) => {
        setNotification({ show: false, message: '', isError: false });

        try {
            // Gọi API để đặt lại mật khẩu
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.patch(`${apiUrl}/user/reset-password/${values.token}`, { // Token được đặt trong URL
                password: values.password,
                passwordConfirm: values.passwordConfirm
            });

            const data = response.data;

            if (data.status === "success") {
                showNotification("Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...", false);
                setTimeout(backToLogin, 2000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Token không hợp lệ hoặc đã hết hạn.";
            showNotification(errorMessage, true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content" style={{ maxWidth: '450px' }}>
                <button onClick={resetStates} className="popup-close-btn">
                    <X size={24} />
                </button>

                <Formik
                    initialValues={{ token: '', password: '', passwordConfirm: '' }}
                    validationSchema={resetPasswordSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="popup-form">
                            <h2>Đặt lại mật khẩu</h2>

                            <div className="form-group">
                                <label htmlFor="token">Token từ Email</label>
                                <Field type="text" id="token" name="token" className="form-input" />
                                <ErrorMessage name="token" component="div" className="error-message-field" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Mật khẩu mới</label>
                                <div className="password-group">
                                    <Field type={showPassword ? "text" : "password"} id="password" name="password" className="form-input" />
                                    <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </span>
                                </div>
                                <ErrorMessage name="password" component="div" className="error-message-field" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="passwordConfirm">Xác nhận mật khẩu mới</label>
                                <div className="password-group">
                                    <Field type={showPassword ? "text" : "password"} id="passwordConfirm" name="passwordConfirm" className="form-input" />
                                    <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </span>
                                </div>
                                <ErrorMessage name="passwordConfirm" component="div" className="error-message-field" />
                            </div>

                            {notification.show && (
                                <p className={`error-message ${!notification.isError ? 'success-message' : ''}`}>
                                    {notification.message}
                                </p>
                            )}
                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang xác nhận...' : 'Xác nhận'}
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

export default ResetPassword;