import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { useOrderService } from "../../services/useOrderService";

export default function MyOrders() {
  const { user } = useAuth();
  const { getMyOrders, loading, error } = useOrderService();
  const [orders, setOrders] = useState([]);
  const location = useLocation(); // Sử dụng useLocation
  const [shouldRefetch, setShouldRefetch] = useState(false);

  // Kích hoạt re-fetch nếu có state orderPlaced từ navigate
  useEffect(() => {
    if (location.state?.orderPlaced) {
      setShouldRefetch(true);
      // Xóa state để tránh re-fetch không cần thiết khi quay lại trang
      window.history.replaceState({}, document.title); 
    }
  }, [location.state]);


  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const response = await getMyOrders();
          setOrders(response.data.orders);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
          // Handle error display to user
        } finally {
          setShouldRefetch(false); // Đặt lại sau khi fetch xong
        }
      }
    };
    fetchOrders();
  }, [user, getMyOrders, shouldRefetch]); // Thêm shouldRefetch vào dependency array

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-xl font-semibold">Vui lòng đăng nhập để xem đơn hàng của bạn.</p>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-xl font-semibold">Đang tải đơn hàng...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh] text-red-500">
          <p className="text-xl font-semibold">Lỗi khi tải đơn hàng: {error}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-xl font-semibold">Bạn chưa có đơn hàng nào.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 md:p-8 min-h-[80vh]">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Đơn hàng của tôi</h1>
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Mã đơn hàng: {order._id}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-lg font-bold text-gray-800">Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')}₫</p>
              <Link to={`/orders/${order._id}`} className="mt-4 inline-block text-blue-600 hover:underline">
                Xem chi tiết đơn hàng
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}