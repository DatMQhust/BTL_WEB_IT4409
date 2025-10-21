import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App.jsx';
// import HomePage from './pages/HomePage.jsx'; // 1. Tạm thời bình luận (comment out) dòng import này
import './index.css'; // File CSS chính chứa Tailwind

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>

          {/* 2. Tạm thời bình luận Route của trang chủ.
             Bây giờ, khi vào trang '/', <Outlet /> trong App.jsx sẽ không hiển thị gì cả.
          */}
          {/* <Route index element={<HomePage />} /> */}

        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

