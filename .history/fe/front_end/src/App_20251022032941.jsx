import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // Dùng để hiển thị nội dung trang con
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";

// (Giả sử bạn cũng có Footer)

function App() {
  // Logic giả để mở popup login
  const handleLoginPopup = () => {
    alert("Login Popup Mở!");
  };

  return (
    <div className="App">
      {/* 2. Đặt Navbar ở trên cùng */}
      <Navbar handleLoginPopup={handleLoginPopup} />

      {/* <Outlet /> sẽ là nơi Home, BooksList... hiển thị */}
      <main className="container mx-auto py-8">
        <Outlet />
        {/* Để trống, React Router sẽ tự lấp đầy */}
        <div>Đây là nội dung trang...</div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default App;