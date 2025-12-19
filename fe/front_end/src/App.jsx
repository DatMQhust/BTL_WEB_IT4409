import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar"; 
import Footer from "./components/Footer/Footer"; 
import Home from "./pages/Home/Home";
import Booklist from "./pages/Booklist/Booklist";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Cart from "./pages/Cart/Cart";
import MyOrders from "./pages/Order/MyOrders";
import OrderDetail from "./pages/Order/OrderDetail";
import Checkout from "./pages/Order/Checkout";
import AdminLayout from "./pages/Admin/AdminLayout";
import Authors from "./pages/Admin/Author";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <Navbar setShowLogin={setShowLogin} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Booklist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<MyOrders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/placeorder" element={<Checkout />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="author" element={<Authors />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;