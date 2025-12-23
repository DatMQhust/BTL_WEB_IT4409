import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Nếu có token, thử lấy thông tin người dùng từ localStorage
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                // Nếu có lỗi, dọn dẹp localStorage
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setToken(null);
            }
        }
    }, [token]);

    useEffect(() => {
        // This effect syncs user state to localStorage
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            // When user logs out or is null, remove from storage
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        // The useEffect above will handle setting the user in localStorage
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        // The useEffect above will handle removing the user from localStorage
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
