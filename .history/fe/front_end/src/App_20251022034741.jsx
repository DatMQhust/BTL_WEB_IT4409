import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App.jsx';
import HomePage from './pages/HomePage.jsx'; // Trang chủ để hiển thị
import './index.css'; // File CSS chính chứa Tailwind

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. Bọc toàn bộ ứng dụng trong <BrowserRouter>. 
      Điều này cung cấp "context" (ngữ cảnh) mà useLocation cần.
    */}
    <BrowserRouter>
      <Routes>
        {/* 2. Route cha là App.jsx, nó sẽ luôn hiển thị Navbar và Footer.
          <Outlet /> trong App.jsx sẽ là nơi các Route con bên dưới hiển thị.
        */}
        <Route path="/" element={<App />}>
          {/* 3. Khi ở trang chủ ('/'), hiển thị component HomePage */}
          <Route index element={<HomePage />} />

          {/* Bạn có thể thêm các trang khác ở đây, ví dụ: */}
          {/* <Route path="books" element={<BooksPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
