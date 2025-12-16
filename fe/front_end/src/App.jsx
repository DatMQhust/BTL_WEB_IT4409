import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar"; // Import Navbar
import Footer from "./components/Footer/Footer"; // Import Footer
import Home from "./pages/Home/Home";
import Booklist from "./pages/Booklist/Booklist";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Cart from "./pages/Cart/Cart";
import Order from "./pages/Order/Order";
import MyOrders from "./pages/Order/MyOrders";
import OrderDetail from "./pages/Order/OrderDetail";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <Navbar setShowLogin={setShowLogin} /> {/* Khôi phục Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Booklist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
      </Routes>
      <Footer /> {/* Khôi phục Footer */}
    </>
  );
}

export default App;
