import React from "react";
import { Outlet } from "react-router-dom"; // Dùng để hiển thị nội dung các trang con
import Navbar from "./components/Navbar/Navbar.jsx"; // Đường dẫn đến Navbar
import Footer from "./components/Footer/Footer.jsx";   // Đường dẫn đến Footer

function App() {
  // Logic này sẽ được truyền xuống Navbar để mở popup đăng nhập
  const handleLoginPopup = () => {
    alert("Login Popup Mở!");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar sẽ luôn hiển thị ở trên cùng */}
      <Navbar handleLoginPopup={handleLoginPopup} />

      {/* <Outlet /> là một placeholder đặc biệt từ React Router.
        Nó sẽ là nơi nội dung của các trang con (HomePage, BooksPage, etc.) 
        được "bơm" vào.
      */}
      <main className="flex-grow container mx-auto py-8">
        <Outlet />
      </main>

      {/* Footer sẽ luôn hiển thị ở dưới cùng */}
      <Footer />
    </div>
  );
}

export default App;