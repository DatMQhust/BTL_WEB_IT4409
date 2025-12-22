import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Users from "./pages/Admin/Users/Users";
import Orders from "./pages/Admin/Orders/Orders";
import Books from "./pages/Admin/Books/Books";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  // Toggle a body class to remove the global top padding when on admin routes
  React.useEffect(() => {
    const isAdmin = location.pathname.startsWith('/admin');
    if (isAdmin) document.body.classList.add('no-navbar');
    else document.body.classList.remove('no-navbar');
  }, [location.pathname]);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      {/* Hide the site Navbar on admin routes */}
      {!location.pathname.startsWith('/admin') && (
        <Navbar setShowLogin={setShowLogin} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/books" element={<Booklist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/placeorder" element={<Checkout />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="author" element={<Authors />} />
          <Route path="books" element={<Books />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;