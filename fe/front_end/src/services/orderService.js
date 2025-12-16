import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api"; // Adjust if your backend URL is different

export const orderService = () => {
    const { token } = useAuth();

    const createOrder = async (orderData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to create order");
            }
            return data;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    };

    const getMyOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch my orders");
            }
            return data;
        } catch (error) {
            console.error("Error fetching my orders:", error);
            throw error;
        }
    };

    const getOrderDetail = async (orderId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch order detail");
            }
            return data;
        } catch (error) {
            console.error("Error fetching order detail:", error);
            throw error;
        }
    };

    return { createOrder, getMyOrders, getOrderDetail };
};
