import React, { useState } from 'react';
import './LoginPopup.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { X } from 'lucide-react';
import axios from 'axios';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import logo from '../../assets/website/logo.png'; // Import logo
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPopup = ({ setShowLogin }) => {
    const { login } = useAuth(); // Lấy hàm login từ context

    // State để chuyển đổi giữa màn hình đăng nhập và đăng ký
    const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', hoặc 'forgot'

    // State cho các form
    const [notification, setNotification] = useState({ show: false, message: '', isError: true });

    const showNotification = (message, isError = true) => {
        setNotification({ show: true, message, isError });
        setTimeout(() => setNotification({ show: false, message: '', isError: false }), 3000);
    };

    const handleLoginSubmit = async (values, { setSubmitting }) => {
        setNotification({ show: false, message: '', isError: false });
        const apiUrl = import.meta.env.VITE_API_URL;

        try {
            const response = await axios.post(`${apiUrl}/user/login`, {
                identifier: values.identifier, // Sử dụng 'identifier' chung
                password: values.password,
            });

            if (response.data.status === "success") {
                // Đăng nhập thành công
                showNotification("Đăng nhập thành công! Đang chuyển hướng...", false); // isError = false
                // Gọi hàm login từ AuthContext để cập nhật trạng thái toàn cục
                login(response.data.token, response.data.data.user);
                // Đóng popup ngay lập tức
                setShowLogin(false);
            } else {
                // Các lỗi khác từ server
                showNotification(response.data.message || 'Email hoặc mật khẩu không đúng.', true);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Email hoặc mật khẩu không đúng.';
            showNotification(errorMessage, true);
        } finally {
            setSubmitting(false); // Kích hoạt lại nút bấm
        }
    };

    // Nếu không phải màn hình login, hiển thị component SignUp
    if (currentView === 'signup') {
        return <SignUp
            resetStates={() => setShowLogin(false)}
            backToLogin={() => setCurrentView('login')}
        />;
    }

    // Nếu là màn hình quên mật khẩu, hiển thị component ForgotPassword
    if (currentView === 'forgot') {
        return <ForgotPassword
            resetStates={() => setShowLogin(false)}
            backToLogin={() => setCurrentView('login')}
        />;
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button onClick={() => setShowLogin(false)} className="popup-close-btn">
                    <X size={24} />
                </button>

                {/* --- Form Đăng nhập --- */}
                <Formik
                    initialValues={{ identifier: '', password: '' }}
                    validationSchema={loginSchema}
                    onSubmit={handleLoginSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="popup-form">
                            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                <img src={logo} alt="Book Store" style={{ width: '80px', display: 'inline-block' }} />
                            </div>
                            <h2>Đăng nhập</h2>
                            <div className="form-group">
                                <label htmlFor="login-identifier">Email / Tên đăng nhập</label>
                                <Field type="text" id="login-identifier" name="identifier" className="form-input" />
                                <ErrorMessage name="identifier" component="div" className="error-message-field" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="login-password">Mật khẩu</label>
                                <Field type="password" id="login-password" name="password" className="form-input" />
                                <ErrorMessage name="password" component="div" className="error-message-field" />
                            </div>
                            {notification.show && (
                                <p className={`error-message ${!notification.isError ? 'success-message' : ''}`}>
                                    {notification.message}
                                </p>
                            )}
                            <div className="forgot-password-link">
                                <span onClick={() => setCurrentView('forgot')}>
                                    Quên mật khẩu?
                                </span>
                            </div>
                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
                            </button>
                            <p className="switch-form-text">
                                Chưa có tài khoản?{' '}
                                <span onClick={() => { setCurrentView('signup'); setNotification({ show: false, message: '', isError: false }); }}>
                                    Đăng ký ngay
                                </span>
                            </p>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

const loginSchema = yup.object().shape({
    identifier: yup.string().required("Vui lòng nhập email hoặc tên đăng nhập"),
    password: yup.string().required("Vui lòng nhập mật khẩu"),
});

export default LoginPopup;