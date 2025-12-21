import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from 'lucide-react';
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { useOrderService } from "../../services/useOrderService";
import "./MyOrders.css"; // Import the new CSS

export default function MyOrders() {
  const { user } = useAuth();
  const { getMyOrders, loading, error } = useOrderService();
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const [shouldRefetch, setShouldRefetch] = useState(false);

  useEffect(() => {
    if (location.state?.orderPlaced) {
      setShouldRefetch(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const response = await getMyOrders();
          setOrders(response.data?.orders || []);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
        } finally {
          setShouldRefetch(false);
        }
      }
    };
    fetchOrders();
  }, [user, getMyOrders, shouldRefetch]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered': return 'delivered';
      case 'processing': return 'processing';
      case 'shipped': return 'shipped';
      case 'cancelled': return 'cancelled';
      case 'pending':
      default: return 'pending';
    }
  };
  
  const renderLoading = () => (
    <div className="flex justify-center items-center min-h-[60vh]">
      <p className="text-xl font-semibold">Đang tải đơn hàng...</p>
    </div>
  );

  const renderError = () => (
     <div className="flex justify-center items-center min-h-[60vh] text-red-500">
        <p className="text-xl font-semibold">Lỗi khi tải đơn hàng: {error}</p>
      </div>
  );
  
  const renderNoUser = () => (
     <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-xl font-semibold">Vui lòng đăng nhập để xem đơn hàng của bạn.</p>
      </div>
  );

  const renderNoOrders = () => (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Bạn chưa có đơn hàng nào</h2>
        <p className="text-gray-500 mt-2">Tất cả các đơn hàng của bạn sẽ được hiển thị ở đây.</p>
        <Link to="/books" className="mt-6 inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Bắt đầu mua sắm
        </Link>
      </div>
  );

  return (
    <>
      <Navbar />
      <div className="my-orders-page p-4 md:p-8 min-h-[80vh]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Đơn hàng của tôi</h1>
          
          {!user ? renderNoUser() : loading ? renderLoading() : error ? renderError() : (
            orders.length === 0 ? renderNoOrders() : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link to={`/orders/${order._id}`} key={order._id} className="order-card-link">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                      {/* Left Side */}
                      <div className="flex-grow mb-4 sm:mb-0">
                        <div className="flex items-center gap-4">
                           <span className="font-bold text-lg text-gray-800">#{order.orderCode || order._id.slice(-6)}</span>
                           <span className={`status-badge ${getStatusClass(order.status)}`}>
                              {order.status}
                           </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      {/* Right Side */}
                      <div className="flex items-center justify-between">
                         <div className="text-right mr-6">
                            <p className="text-sm text-gray-500">Tổng cộng</p>
                            <p className="font-bold text-lg text-blue-600">{order.totalAmount.toLocaleString('vi-VN')}₫</p>
                         </div>
                         <ChevronRight className="text-gray-400" size={24}/>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}