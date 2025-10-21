import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 2. Đặt App.js làm layout chính */}
        <Route path="/" element={<App />}>
          {/* Định nghĩa các trang con ở đây (chưa cần vội) */}
          {/* <Route index element={<HomePage />} /> */}
          {/* <Route path="books" element={<BooksPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
    <App />
  </StrictMode>,
)
