import { useState, useCallback } from 'react';
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // base URL for backend

export const useOrderService = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const callApi = useCallback(async (endpoint, options) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    ...options.headers,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `API Error: ${response.status}`);
            }
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]); // Re-create if token changes

    const createOrder = useCallback(async (orderData) => {
        return callApi("/orders", {
            method: "POST",
            body: JSON.stringify(orderData),
        });
    }, [callApi]);

    const getMyOrders = useCallback(async () => {
        return callApi("/orders/my-orders", {
            method: "GET",
        });
    }, [callApi]);

    const getOrderDetail = useCallback(async (orderId) => {
        return callApi(`/orders/${orderId}`, {
            method: "GET",
        });
    }, [callApi]);

    const confirmPayment = useCallback(async (orderId) => {
        return callApi(`/orders/${orderId}/pay`, {
            method: "PATCH",
        });
    }, [callApi]);

    return {
        createOrder,
        getMyOrders,
        getOrderDetail,
        confirmPayment,
        loading,
        error
    };
};
