import React, { useState, useEffect } from "react";
import OTPInput from "react-otp-input";
import { X } from 'lucide-react';
import './LoginPopup.css'; // Tái sử dụng CSS chung

const Verify = ({ resetStates, backToLogin, mail, handleNotice, forgotPassword, verifyPhone }) => {
    const [code, setCode] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', isError: false });
    const apiUrl = import.meta.env.VITE_API_URL;

    // --- TOÀN BỘ LOGIC ĐƯỢC GIỮ NGUYÊN ---

    const showNotification = (message, isError = false) => {
        setNotification({ show: true, message, isError });
        setTimeout(() => {
            setNotification({ show: false, message: '', isError: false });
        }, 3000);
    };

    const getApiEndpoint = () => {
        if (verifyPhone) return `${apiUrl}/user/verify-phone`;
        if (forgotPassword) {
            // This seems to be an alternative password reset flow using OTP
            return `${apiUrl}/user/reset-password`;
        }
        return `${apiUrl}/user/verify-email`;
    };

    const handleVerifySubmit = () => {
        if (!code || code.length !== 6) {
            showNotification("Vui lòng nhập đủ 6 chữ số.", true);
            return;
        }
        let requestBody;
        if (verifyPhone) {
            requestBody = {
                phoneNumber: mail.phone,
                code: code
            };
        } else if (forgotPassword) {
            requestBody = {
                email: mail.infor, // Giả sử `infor` là email
                password: mail.password,
                code: code
            };
        } else {
            requestBody = { ...mail, code };
        }

        const endpoint = getApiEndpoint();

        fetch(endpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json().catch(() => response.text());
                    const errorMessage = errorData.message || errorData || 'Network error';
                    throw new Error(errorMessage);
                }
                // Dựa vào Postman, API reset-password và verify-email có thể trả về JSON.
                // Chỉ khi nào backend trả về text thuần thì mới cần xử lý riêng.
                return forgotPassword ? response.text() : response.json();
            })
            .then((data) => {
                if (verifyPhone) {
                    if (data.status === "success" && data.token) {
                        showNotification("Xác thực thành công! Đang đăng nhập...", false);
                        // TODO: Lưu token và xử lý đăng nhập
                        setTimeout(backToLogin, 1500);
                    } else {
                        showNotification(data.message || "Mã xác thực không đúng.", true);
                    }
                } else if (forgotPassword) {
                    if (data === "ok") {
                        showNotification("Đổi mật khẩu thành công!", false);
                        setTimeout(backToLogin, 1500);
                    } else {
                        showNotification("Mã xác thực không đúng.", true);
                    }
                } else { // Trường hợp đăng ký
                    if (data.message === 'Your account is enable! Log in now!') {
                        showNotification(data.message, false);
                        setTimeout(backToLogin, 1500);
                    } else {
                        // Các trường hợp lỗi khác từ backend
                        showNotification(data.message || "Mã xác thực không đúng.", true);
                    }
                }
            })
            .catch((error) => {
                console.error("Error verifying code:", error);
                showNotification(error.message || "Có lỗi xảy ra, vui lòng thử lại.", true);
            });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content" style={{ maxWidth: '450px' }}>
                <button onClick={resetStates} className="popup-close-btn">
                    <X size={24} />
                </button>
                <div className="popup-form">
                    <h2>Xác thực tài khoản</h2>
                    <p className="verify-instruction">
                        Vui lòng nhập mã OTP gồm 6 chữ số đã được gửi đến email hoặc số điện thoại của bạn.
                    </p>
                    {notification.show && (
                        <p className={`error-message ${!notification.isError ? 'success-message' : ''}`}>
                            {notification.message}
                        </p>
                    )}
                    <div className="otp-container">
                        <OTPInput
                            value={code}
                            onChange={setCode}
                            numInputs={6}
                            renderInput={(props) => <input {...props} />}
                            containerStyle="otp-input-container"
                            inputStyle="otp-input"
                        />
                    </div>
                    <button type="button" className="submit-btn" onClick={handleVerifySubmit}>
                        Xác nhận
                    </button>

                    <p className="switch-form-text">
                        Chưa nhận được mã?{' '}
                        <span onClick={() => { /* TODO: Thêm logic gửi lại mã */ }}>
                            Gửi lại
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div >
    );
};

export default Verify;