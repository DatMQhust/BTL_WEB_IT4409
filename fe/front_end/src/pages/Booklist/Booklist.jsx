import React, { useEffect, useState } from "react";
import FilterSidebar from "./FilterSidebar";
import "./BookList.css";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  //lấy danh sách sách từ backend
  useEffect(() => {
    fetch("http://localhost:5173/books") 
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  }, []);

  // Nhận dữ liệu lọc từ FilterSidebar
  const handleFilter = ({ category, minPrice, maxPrice, keyword }) => {
    const filtered = books.filter((book) => {
      const matchCategory = category ? book.category === category : true;
      const matchPrice = book.price >= minPrice && book.price <= maxPrice;
      const matchKeyword = keyword
        ? book.title.toLowerCase().includes(keyword.toLowerCase())
        : true;
      return matchCategory && matchPrice && matchKeyword;
    });
    setFilteredBooks(filtered);
  };

  return (
    <div className="booklist-page">
      <aside className="filter-section">
        <FilterSidebar onFilter={handleFilter} />
      </aside>

      <main className="booklist-section">
        {filteredBooks.length > 0 ? (
          <div className="booklist-grid">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="no-result">Không tìm thấy sách phù hợp</p>
        )}
      </main>
    </div>
  );
};

export default BookList;
