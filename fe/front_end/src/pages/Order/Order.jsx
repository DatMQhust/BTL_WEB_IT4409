import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar"; // Assuming Navbar is needed
import Footer from "../../components/Footer/Footer"; // Assuming Footer is needed
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useOrderService } from "../../services/useOrderService"; // Import the new hook

export default function Order() { // Đổi tên component từ CheckoutPage thành Order
  const { user } = useAuth();
  const { cart, clearCart, cartItemCount } = useCart();
  const { createOrder, loading, error } = useOrderService();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default to Cash on Delivery
  const [orderError, setOrderError] = useState(null);

  useEffect(() => {
    // Redirect to cart if it's empty
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderError(null); // Clear previous errors

    if (!user) {
      setOrderError("You must be logged in to place an order.");
      return;
    }

    if (cart.length === 0) {
      setOrderError("Your cart is empty. Please add items before checking out.");
      return;
    }

    // Basic validation
    const { fullName, address, city, postalCode, country, phone } = shippingAddress;
    if (!fullName || !address || !city || !postalCode || !country || !phone) {
      setOrderError("Please fill in all shipping address fields.");
      return;
    }

    try {
      const orderDetails = {
        shippingAddress,
        paymentMethod,
      };
      await createOrder(orderDetails);
      clearCart(); // Clear cart after successful order
      alert("Order placed successfully!");
      navigate("/order", { state: { orderPlaced: true } }); // Navigate to my orders page with state
    } catch (err) {
      setOrderError(err.message || "An unexpected error occurred while placing your order.");
    }
  };

  return (
    <>
      <Navbar /> {/* Assuming Navbar needs to be rendered */}
      <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT SECTION - Order Form */}
        <div className="border rounded-lg shadow p-6 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Thông tin đặt hàng</h2>
          {orderError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{orderError}</div>}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">Error: {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Địa chỉ giao hàng</h3>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={shippingAddress.fullName}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingAddress.address}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">Thành phố</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Mã bưu chính</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Quốc gia</label>
              <input
                type="text"
                id="country"
                name="country"
                value={shippingAddress.country}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <h3 className="text-xl font-semibold mb-3 pt-6 text-gray-700">Phương thức thanh toán</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={handlePaymentMethodChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="cod" className="ml-3 block text-base font-medium text-gray-700">Thanh toán khi nhận hàng (COD)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sepay"
                  name="paymentMethod"
                  value="SePay"
                  checked={paymentMethod === "SePay"}
                  onChange={handlePaymentMethodChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="sepay" className="ml-3 block text-base font-medium text-gray-700">Chuyển khoản ngân hàng (SePay - Tự động xác nhận)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="vietqr"
                  name="paymentMethod"
                  value="VietQR"
                  checked={paymentMethod === "VietQR"}
                  onChange={handlePaymentMethodChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="vietqr" className="ml-3 block text-base font-medium text-gray-700">Thanh toán qua chuyển khoản (VietQR)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="eth"
                  name="paymentMethod"
                  value="ETH"
                  checked={paymentMethod === "ETH"}
                  onChange={handlePaymentMethodChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="eth" className="ml-3 block text-base font-medium text-gray-700">Thanh toán bằng Crypto (ETH)</label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {loading ? "Đang đặt hàng..." : `Đặt hàng (${cartItemCount} sản phẩm)`}
            </button>
          </form>
        </div>

        {/* RIGHT SECTION - Payment Instructions (unchanged from original) */}
        <div className="border rounded-lg shadow p-6 bg-white overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Hướng dẫn thanh toán</h2>

          <h3 className="font-semibold text-green-600 mb-2">1. Phương thức thanh toán</h3>
          <ul className="list-disc ml-6 mb-4">
            <li>Thanh toán khi nhận hàng (COD)</li>
            <li>Chuyển khoản ngân hàng (SePay - Tự động xác nhận)</li>
            <li>Thanh toán chuyển khoản ngân hàng (VietQR)</li>
            <li>Thanh toán bằng Crypto (ETH)</li>
          </ul>

          <h3 className="font-semibold text-yellow-600 mb-2">2. Quy tắc chuyển khoản</h3>
          <ul className="list-disc ml-6 mb-4">
            <li>Vui lòng chuyển khoản đúng số tiền được hiển thị</li>
            <li>
              Ghi nội dung chuyển khoản theo cú pháp:{" "}
              <span className="font-bold">[Họ và tên] + [Số điện thoại đã đăng ký]</span>
            </li>
            <li>
              Ví dụ: <span className="font-bold">NguyenVanA 0987654321</span>
            </li>
            <li>Sau khi chuyển khoản xong, nhấn nút "Check Payment"</li>
            <li>Thời gian xử lý: 30s - 1 phút</li>
          </ul>

          <h3 className="font-semibold text-yellow-600 mb-2">3. Lưu ý quan trọng</h3>
          <ul className="list-disc ml-6 mb-4">
            <li>Đơn hàng sẽ tự động hủy sau 24 giờ nếu chưa thanh toán</li>
            <li>Địa chỉ nhận hàng là địa chỉ bạn đã cài đặt</li>
            <li>Số điện thoại nhận hàng là số điện thoại bạn đăng ký</li>
            <li>Nếu chuyển thừa tiền, hệ thống sẽ cộng vào tài khoản xu của bạn</li>
            <li>Nếu chuyển thiếu tiền hoặc nội dung sai, vui lòng liên hệ hỗ trợ</li>
          </ul>

          <h3 className="font-semibold text-blue-600 mb-2">4. Hỗ trợ</h3>
          <ul className="list-disc ml-6 mb-4">
            <li>Hotline: 0948377358</li>
            <li>Email: Quy160104@gmail.com</li>
            <li>Thời gian hỗ trợ: Buổi tối (19h - 23h)</li>
          </ul>
        </div>
      </div>
      <Footer /> {/* Assuming Footer needs to be rendered */}
    </>
  );
}