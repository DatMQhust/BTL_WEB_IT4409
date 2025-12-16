import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { useOrderService } from "../../services/useOrderService";

export default function OrderDetail() {
  const { id } = useParams(); // Get order ID from URL
  const { user } = useAuth();
  const { getOrderDetail, loading, error } = useOrderService();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (user && id) {
        try {
          const response = await getOrderDetail(id);
          setOrder(response.data.order);
        } catch (err) {
          console.error("Failed to fetch order details:", err);
          // Handle error display to user
        }
      }
    };
    fetchOrder();
  }, [user, id, getOrderDetail]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-xl font-semibold">Vui lòng đăng nhập để xem chi tiết đơn hàng.</p>
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
          <p className="text-xl font-semibold">Đang tải chi tiết đơn hàng...</p>
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
          <p className="text-xl font-semibold">Lỗi khi tải chi tiết đơn hàng: {error}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-xl font-semibold">Không tìm thấy đơn hàng này.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 md:p-8 min-h-[80vh]">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Chi tiết đơn hàng #{order._id}</h1>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Thông tin đơn hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600"><span className="font-medium">Trạng thái:</span> {order.status}</p>
              <p className="text-gray-600"><span className="font-medium">Trạng thái thanh toán:</span> {order.paymentStatus}</p>
              <p className="text-gray-600"><span className="font-medium">Phương thức thanh toán:</span> {order.paymentMethod}</p>
              <p className="text-gray-600"><span className="font-medium">Ngày đặt:</span> {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
              {order.updatedAt && <p className="text-gray-600"><span className="font-medium">Cập nhật cuối:</span> {new Date(order.updatedAt).toLocaleDateString()} {new Date(order.updatedAt).toLocaleTimeString()}</p>}
            </div>
            <div>
              <p className="text-gray-600"><span className="font-medium">Tổng tiền:</span> {order.totalAmount.toLocaleString('vi-VN')}₫</p>
              {order.user && (
                <>
                  <p className="text-gray-600"><span className="font-medium">Người đặt:</span> {order.user.name}</p>
                  <p className="text-gray-600"><span className="font-medium">Email:</span> {order.user.email}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Địa chỉ giao hàng</h2>
          {order.shippingAddress ? (
            <div>
              <p className="text-gray-600"><span className="font-medium">Họ và tên:</span> {order.shippingAddress.fullName}</p>
              <p className="text-gray-600"><span className="font-medium">Địa chỉ:</span> {order.shippingAddress.address}</p>
              <p className="text-gray-600"><span className="font-medium">Thành phố:</span> {order.shippingAddress.city}</p>
              <p className="text-gray-600"><span className="font-medium">Mã bưu chính:</span> {order.shippingAddress.postalCode}</p>
              <p className="text-gray-600"><span className="font-medium">Quốc gia:</span> {order.shippingAddress.country}</p>
              <p className="text-gray-600"><span className="font-medium">Số điện thoại:</span> {order.shippingAddress.phone}</p>
            </div>
          ) : (
            <p className="text-gray-600">Không có thông tin địa chỉ giao hàng.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Sản phẩm trong đơn hàng</h2>
          {order.items && order.items.length > 0 ? (
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.product._id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <img src={item.product.coverImageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="font-medium text-gray-800">{item.product.name}</p>
                    <p className="text-gray-600">Số lượng: {item.quantity}</p>
                    <p className="text-gray-600">Giá: {item.price.toLocaleString('vi-VN')}₫</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Không có sản phẩm nào trong đơn hàng này.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
