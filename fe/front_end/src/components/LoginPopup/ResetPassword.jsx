import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { X } from 'lucide-react';
import './LoginPopup.css'; // Tái sử dụng CSS chung

const ResetPassword = ({ resetStates, backToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        token: "",
        password: "",
        passwordConfirm: "",
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

        if (formData.password !== formData.passwordConfirm) {
            showNotification("Mật khẩu xác nhận không khớp.", true);
            return;
        }

        if (!formData.token) {
            showNotification("Vui lòng nhập token.", true);
            return;
        }

        // Gọi API để đặt lại mật khẩu
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/auth/reset-password/${formData.token}`, { // Token được đặt trong URL
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: formData.password,
                passwordConfirm: formData.passwordConfirm
            })
        }).then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Token không hợp lệ hoặc đã hết hạn.");
            }
            return data;
        }).then((data) => {
            if (data.status === "success") {
                showNotification("Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...", false);
                setTimeout(backToLogin, 2000);
            }
        }).catch(error => {
            showNotification(error.message, true);
        });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content" style={{ maxWidth: '450px' }}>
                <button onClick={resetStates} className="popup-close-btn">
                    <X size={24} />
                </button>

                <form onSubmit={handleFormSubmit} className="popup-form">
                    <h2>Đặt lại mật khẩu</h2>

                    <div className="form-group">
                        <label htmlFor="token">Token từ Email</label>
                        <input type="text" id="token" name="token" value={formData.token} onChange={handleChange} required />
                    </div>

                    <div className="form-group password-group">
                        <label htmlFor="password">Mật khẩu mới</label>
                        <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange} required />
                        <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    <div className="form-group password-group">
                        <label htmlFor="passwordConfirm">Xác nhận mật khẩu mới</label>
                        <input type={showPassword ? "text" : "password"} id="passwordConfirm" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} required />
                    </div>

                    {error && <p className={`error-message ${error.includes('thành công') ? 'success-message' : ''}`}>{error}</p>}
                    <button type="submit" className="submit-btn">Xác nhận</button>
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

export default ResetPassword;