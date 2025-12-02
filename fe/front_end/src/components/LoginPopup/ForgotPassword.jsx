import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { X } from 'lucide-react';
import './LoginPopup.css'; // Tái sử dụng CSS từ LoginPopup
import ResetPassword from "./ResetPassword"; // Import component ResetPassword

const ForgotPassword = ({ resetStates, backToLogin, handleVerify, handleMail }) => {
    const [error, setError] = useState('');
    const [view, setView] = useState('forgot'); // 'forgot' hoặc 'reset'
    const [formData, setFormData] = useState({
        email: "", // Chỉ cần email theo API
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showNotification = (message, isError = false) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 3000);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Gọi API để yêu cầu gửi token reset mật khẩu
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/auth/forgot-password`, { // Sử dụng đúng endpoint API
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: formData.email }) // Chỉ gửi email
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Tài khoản không tồn tại hoặc có lỗi xảy ra.");
            }
            return response.json();
        }).then((data) => {
            if (data.status === "success") {
                showNotification(data.message, false);
                // Chuyển sang màn hình nhập token và mật khẩu mới
                setTimeout(() => setView('reset'), 1000);
            } else {
                showNotification("Không tìm thấy tài khoản với email hoặc SĐT này.", true);
            }
        }).catch(error => {
            showNotification(error.message, true);
        });
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

                <form onSubmit={handleFormSubmit} className="popup-form">
                    <h2>Quên mật khẩu</h2>

                    <div className="form-group">
                        <label htmlFor="email">Nhập email đã đăng ký</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    {error && <p className={`error-message ${!error.includes('lỗi') && !error.includes('tồn tại') ? 'success-message' : ''}`}>{error}</p>}
                    <button type="submit" className="submit-btn">Gửi yêu cầu</button>
                    <p className="switch-form-text">
                        Đã nhớ mật khẩu?{' '}
                        <span onClick={backToLogin}>
                            Đăng nhập
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;