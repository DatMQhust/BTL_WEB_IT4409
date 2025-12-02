import React, { useState } from 'react';
import './LoginPopup.css';
import { X } from 'lucide-react';
import axios from 'axios';
import SignUp from './SignUp'; // Import component SignUp mới

const LoginPopup = ({ setShowLogin }) => {
    // State để chuyển đổi giữa màn hình đăng nhập và đăng ký
    const [currentView, setCurrentView] = useState('login'); // 'login' hoặc 'signup'

    // State cho các form
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log('Đang đăng nhập với:', loginData);
        // TODO: Thêm logic gọi API đăng nhập tại đây
        // Ví dụ:
        // try {
        //   const response = await axios.post('API_URL/login', loginData);
        //   // Xử lý đăng nhập thành công
        //   handlePopup(false);
        // } catch (err) {
        //   setError('Email hoặc mật khẩu không đúng.');
        // }
    };

    // Nếu không phải màn hình login, hiển thị component SignUp
    if (currentView === 'signup') {
        return <SignUp
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
                <form onSubmit={handleLoginSubmit} className="popup-form">
                    <h2>Đăng nhập</h2>
                    <div className="form-group">
                        <label htmlFor="login-email">Email</label>
                        <input type="email" id="login-email" name="email" value={loginData.email} onChange={handleLoginChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="login-password">Mật khẩu</label>
                        <input type="password" id="login-password" name="password" value={loginData.password} onChange={handleLoginChange} required />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="submit-btn">Đăng nhập</button>
                    <p className="switch-form-text">
                        Chưa có tài khoản?{' '}
                        <span onClick={() => { setCurrentView('signup'); setError(''); }}>
                            Đăng ký ngay
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPopup;