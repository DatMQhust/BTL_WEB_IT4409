import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Booklist from "./pages/Booklist/Booklist";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Payment from "./pages/Payment/Payment";
import Cart from "./pages/Cart/Cart";
import MyOrders from "./pages/Order/MyOrders";
import OrderDetail from "./pages/Order/OrderDetail";
import Checkout from "./pages/Order/Checkout";
import Profile from "./pages/Profile/Profile";
import AdminLayout from "./pages/Admin/AdminLayout";
import Authors from "./pages/Admin/Author/Author";
import Books from "./pages/Admin/Book/Book";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Revenue from "./pages/Admin/Revenue/Revenue";
import User from "./pages/Admin/User/User";
import Order from "./pages/Admin/Order/Order";
import Category from "./pages/Admin/Category/Category";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  // Toggle a body class to remove the global top padding when on admin routes
  React.useEffect(() => {
    const isAdmin = location.pathname.startsWith('/admin');
    if (isAdmin) document.body.classList.add('no-navbar');
    else document.body.classList.remove('no-navbar');
  }, [location.pathname]);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />

      {/* Hide the site Navbar on admin routes */}
      {!location.pathname.startsWith('/admin') && (
        <Navbar setShowLogin={setShowLogin} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        *<Route path="/payment" element={<Payment />} />
        <Route path="/books" element={<Booklist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/placeorder" element={<Checkout />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/author" element={<Authors />} />
          <Route path="/admin/book" element={<Books />} />
          <Route path="/admin/revenue" element={<Revenue />} />
          <Route path="/admin/user" element={<User />} />
          <Route path="/admin/order" element={<Order />} />
          <Route path="/admin/category" element={<Category />} />
        </Route>
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}

export default App;