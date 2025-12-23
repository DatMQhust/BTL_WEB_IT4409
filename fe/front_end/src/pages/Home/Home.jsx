import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import './Home.css';
import Book from "../../components/Books/Book";
import { useNavigate } from 'react-router-dom';
import BookDetailPopup from "../../components/Books/BookDetailPopup"; // Import Popup

const Home = () => {
  const { user } = useAuth();
  const [booklist, setBooklist] = useState([]);
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const getBookList = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      try {
        // Fetch more books for a better display, e.g., 6 books
        const response = await axios.get(`${apiUrl}/product?page=1&limit=6`);
        setBooklist(response.data.data.products);
      } catch (error) {
        console.error('Error fetching book list:', error);
      }
    };
    getBookList();
  }, []);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedBook(null);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Chào mừng đến với Nhóm 06</h1>
        <p className="hero-subtitle">Khám phá thế giới với hàng ngàn sản phẩm chất lượng cao</p>
        <Link to="/books" className="hero-button">Khám phá ngay</Link>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="section-header">
          <h2 className="featured-products-title">Sản phẩm nổi bật</h2>
          <p className="featured-products-subtitle">Những sản phẩm được yêu thích nhất</p>
        </div>
        <div className="product-grid">
          {booklist.map((book) => (
            <Book key={book._id} book={book} onBookSelect={handleBookSelect} />
          ))}
        </div>
        <div className="view-all-container">
          <Link to="/books" className="view-all-button">
            Xem tất cả sản phẩm →
          </Link>
        </div>
      </section>

      {/* Render BookDetailPopup when isPopupOpen is true */}
      {isPopupOpen && selectedBook && (
        <BookDetailPopup book={selectedBook} onClose={handleClosePopup} />
      )}
    </main>
  );
};

export default Home;
