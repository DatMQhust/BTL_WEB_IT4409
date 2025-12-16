import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, token } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchCart = useCallback(async () => {
        if (!token) {
            setCart([]);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/cart`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setCart(response.data.data.cart || []);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
            setCart([]);
        } finally {
            setLoading(false);
        }
    }, [apiUrl, token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        if (!token) {
            toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/cart`, { productId, quantity }, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setCart(response.data.data.cart); // Cập nhật state giỏ hàng
            toast.success(response.data.message || "Đã thêm vào giỏ hàng!");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Thêm vào giỏ hàng thất bại.";
            toast.error(errorMessage);
        }
    };

    const updateCartQuantity = async (productId, quantity) => {
        if (!token) return;
        if (quantity < 1) {
            // Nếu số lượng nhỏ hơn 1, hãy xóa sản phẩm
            return removeFromCart(productId);
        }
        try {
            const response = await axios.patch(`${apiUrl}/cart/${productId}`, { quantity }, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setCart(response.data.data.cart);
            toast.success("Đã cập nhật số lượng sản phẩm!");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Cập nhật thất bại.";
            toast.error(errorMessage);
        }
    };

    const removeFromCart = async (productId) => {
        if (!token) return;
        try {
            const response = await axios.delete(`${apiUrl}/cart/${productId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setCart(response.data.data.cart);
            toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Xóa thất bại.";
            toast.error(errorMessage);
        }
    };

    const clearCart = async () => {
        if (!token) return;
        try {
            const response = await axios.delete(`${apiUrl}/cart`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setCart(response.data.data.cart);
            toast.success("Đã xóa toàn bộ giỏ hàng.");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Xóa thất bại.";
            toast.error(errorMessage);
        }
    };

    const value = {
        cart,
        loading,
        fetchCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartItemCount: cart.reduce((acc, item) => acc + item.quantity, 0)
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
