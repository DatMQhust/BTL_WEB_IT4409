import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import axios from "axios";
import { X } from 'lucide-react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginPopup.css";

const SignUp = ({ resetStates, backToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: "", isError: false });

    const showNotification = (message, isError = false) => {
        setNotification({ show: true, message, isError });
        setTimeout(() => setNotification({ show: false, message: "", isError: false }), 3000);
    };

    const handleFormSubmit = async (values, { setSubmitting }) => {
        setNotification({ show: false, message: "", isError: false });
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const payload = {
                name: values.name,
                email: values.email,
                password: values.password,
                passwordConfirm: values.passwordConfirm,
                phone: values.phone || undefined, // Gửi phone nếu có, không thì undefined để không gửi
            };

            const response = await axios.post(`${apiUrl}/user/register`, payload);

            if (response.data.status === 'success') {
                showNotification("Tạo tài khoản thành công! Vui lòng đăng nhập.", false);
                setTimeout(backToLogin, 2000);
            } else {
                showNotification(response.data.message || "Đăng ký thất bại. Vui lòng thử lại.", true);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
            showNotification(errorMessage, true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content" style={{ maxWidth: "450px", maxHeight: "90vh", overflowY: "auto" }}>
                <button className="popup-close-btn" onClick={resetStates} aria-label="Close">
                    <X size={24} />
                </button>

                <Formik initialValues={initialValues} validationSchema={signupSchema} onSubmit={handleFormSubmit}>
                    {({ isSubmitting }) => (
                        <Form className="popup-form">
                            <h2>Tạo tài khoản</h2>

                            {notification.show && (
                                <p className={`error-message ${!notification.isError ? 'success-message' : ''}`}>
                                    {notification.message}
                                </p>
                            )}

                            <div className="form-group">
                                <label htmlFor="name">Tên đăng nhập</label>
                                <Field type="text" id="name" name="name" className="form-input" />
                                <ErrorMessage name="name" component="div" className="error-message-field" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Field type="email" id="email" name="email" className="form-input" />
                                <ErrorMessage name="email" component="div" className="error-message-field" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Số điện thoại (tùy chọn)</label>
                                <Field type="tel" id="phone" name="phone" className="form-input" />
                                <ErrorMessage name="phone" component="div" className="error-message-field" />
                            </div>

                            {/* Password */}
                            <div className="form-group">
                                <label htmlFor="password">Mật khẩu</label>
                                <div className="password-group">
                                    <Field type={showPassword ? "text" : "password"} id="password" name="password" className="form-input" />
                                    <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </span>
                                </div>
                                <ErrorMessage name="password" component="div" className="error-message-field" />
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group">
                                <label htmlFor="passwordConfirm">Xác nhận mật khẩu</label>
                                <div className="password-group">
                                    <Field type={showPassword ? "text" : "password"} id="passwordConfirm" name="passwordConfirm" className="form-input" />
                                    <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </span>
                                </div>
                                <ErrorMessage name="passwordConfirm" component="div" className="error-message-field" />
                            </div>

                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang tạo...' : 'Tạo tài khoản'}
                            </button>

                            <p className="switch-form-text">
                                Đã có tài khoản?{" "}
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

/* ============================
   Validation + Initial Values
============================ */

const usernameRegExp = /^[a-zA-Z0-9_.]+$/;
const phoneRegExp = /^[\d]{5,15}$/;
const passwordSafeRegExp = /^[^'";<>\\/]*$/;

const signupSchema = yup.object().shape({
    name: yup.string().matches(usernameRegExp, "Tên đăng nhập không được chứa ký tự đặc biệt").required("Vui lòng nhập tên đăng nhập"),
    email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    phone: yup.string().matches(phoneRegExp, "Số điện thoại không hợp lệ").optional(),
    password: yup.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự").matches(passwordSafeRegExp, "Mật khẩu chứa ký tự không hợp lệ").required("Vui lòng nhập mật khẩu"),
    passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp').required('Vui lòng xác nhận mật khẩu'),
});

const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
};

export default SignUp;
