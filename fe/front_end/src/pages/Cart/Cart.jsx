import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import LoginPopup from "../../components/LoginPopup/LoginPopup";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { user } = useAuth();
  const { cart, loading, updateCartQuantity, removeFromCart, cartItemCount } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateCartQuantity(productId, newQuantity);
    } else {
      removeFromCart(productId);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  if (!user) {
    return (
      <>
        <Navbar setShowLogin={setShowLogin} />
        {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-gray-900 text-center">
          <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Bạn cần đăng nhập để xem giỏ hàng của mình.</p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-green-600 dark:bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-green-700 dark:hover:bg-green-600 transition"
          >
            Đăng nhập
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar setShowLogin={setShowLogin} />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-xl font-semibold">Đang tải giỏ hàng...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar setShowLogin={setShowLogin} />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2 mt-8 px-4 md:px-10 lg:ml-36">Giỏ hàng của bạn</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 px-4 md:px-10 lg:ml-36 text-sm">
          Bạn có {cartItemCount} sản phẩm trong giỏ hàng.
        </p>
        {cart.length > 0 ? (
          <div className="flex flex-col px-1 sm:px-4 md:px-16 lg:px-36">
            <div className="w-full overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <table className="min-w-[700px] w-full text-center">
                <thead className="bg-green-50 dark:bg-green-900/30 border-b dark:border-gray-700">
                  <tr>
                    <th className="py-3 px-2 text-left text-gray-900 dark:text-white">Sản phẩm</th>
                    <th className="py-3 px-2 text-gray-900 dark:text-white">Giá</th>
                    <th className="py-3 px-2 text-gray-900 dark:text-white">Số lượng</th>
                    <th className="py-3 px-2 text-gray-900 dark:text-white">Tổng cộng</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.product._id} className="border-b dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 transition">
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-4 min-h-[96px]">
                          <img src={item.product.coverImageUrl} alt={item.product.name} className="w-16 h-24 object-cover rounded border dark:border-gray-600" />
                          <div className="flex flex-col justify-center h-24 w-full">
                            <div className="font-semibold text-gray-800 dark:text-gray-200 text-left break-words line-clamp-2" style={{ maxWidth: '220px' }}>
                              {item.product.name}
                            </div>
                            <button
                              className="text-red-500 dark:text-red-400 hover:underline text-sm self-start mt-2"
                              onClick={() => removeFromCart(item.product._id)}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-green-600 dark:text-green-400 font-bold align-middle">
                        {item.product.price.toLocaleString('vi-VN')}₫
                      </td>
                      <td className="py-2 px-2 align-middle">
                        <div className="inline-flex items-center border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 shadow-sm">
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                            className="px-3 py-1 text-xl text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition"
                          >-</button>
                          <span className="px-4 py-1 min-w-[32px] text-center text-gray-800 dark:text-white">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                            className="px-3 py-1 text-xl text-gray-700 dark:text-gray-300 border-l border-gray-200 dark:border-gray-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition"
                          >+</button>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-green-700 dark:text-green-400 font-bold align-middle">
                        {(item.product.price * item.quantity).toLocaleString('vi-VN')}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <div className="text-lg font-bold text-green-700 dark:text-green-400">
                Tổng cộng: {calculateTotal().toLocaleString('vi-VN')}₫
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate('/order')}
                className="bg-green-600 dark:bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-green-700 dark:hover:bg-green-600 transition"
              >
                Tiến hành đặt hàng
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-3xl font-bold text-gray-400 dark:text-gray-500 mt-10">Giỏ hàng của bạn đang trống</div>
        )}
        <Footer />
      </div>
    </>
  );
}