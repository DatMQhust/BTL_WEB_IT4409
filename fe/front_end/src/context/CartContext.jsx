import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api'; // Import the centralized axios instance
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth(); // Only need user to decide when to fetch

    const fetchCart = useCallback(async () => {
        if (!user) { // Fetch only if user is logged in
            setCart([]);
            return;
        }
        setLoading(true);
        try {
            const response = await api.get('/cart'); // Use api instance, headers are handled by interceptor
            setCart(response.data.data?.cart || []);
        } catch (error) {
            // 401 errors are handled by the interceptor, but other errors can be logged here
            if (error.response?.status !== 401) {
                console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
            }
            setCart([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }
        try {
            const response = await api.post('/cart', { productId, quantity }); // Use api instance
            setCart(response.data.data?.cart);
            toast.success(response.data.message || "Đã thêm vào giỏ hàng!");
        } catch (error) {
            if (error.response?.status !== 401) {
                const errorMessage = error.response?.data?.message || "Thêm vào giỏ hàng thất bại.";
                toast.error(errorMessage);
            }
        }
    };

    const updateCartQuantity = async (productId, quantity) => {
        if (!user) return;
        if (quantity < 1) {
            return removeFromCart(productId);
        }
        try {
            const response = await api.patch(`/cart/${productId}`, { quantity }); // Use api instance
            setCart(response.data.data?.cart);
            toast.success("Đã cập nhật số lượng sản phẩm!");
        } catch (error) {
            if (error.response?.status !== 401) {
                const errorMessage = error.response?.data?.message || "Cập nhật thất bại.";
                toast.error(errorMessage);
            }
        }
    };

    const removeFromCart = async (productId) => {
        if (!user) return;
        try {
            const response = await api.delete(`/cart/${productId}`); // Use api instance
            setCart(response.data.data?.cart);
            toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
        } catch (error) {
            if (error.response?.status !== 401) {
                const errorMessage = error.response?.data?.message || "Xóa thất bại.";
                toast.error(errorMessage);
            }
        }
    };

    const clearCart = async () => {
        if (!user) return;
        try {
            const response = await api.delete('/cart'); // Use api instance
            setCart(response.data.data?.cart);
            toast.success("Đã xóa toàn bộ giỏ hàng.");
        } catch (error) {
            if (error.response?.status !== 401) {
                const errorMessage = error.response?.data?.message || "Xóa thất bại.";
                toast.error(errorMessage);
            }
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
