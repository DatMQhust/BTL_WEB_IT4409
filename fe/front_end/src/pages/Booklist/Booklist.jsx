import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import FilterSidebar from "./FilterSidebar";
import Book from "../../components/Books/Book";
import Pagination from "../../components/Pagination/Pagination";
import BookDetailPopup from "../../components/Books/BookDetailPopup"; // Import popup component
import "./Booklist.css";

const Booklist = () => {
    const [books, setBooks] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 12,
        search: "",
        categoryId: "",
        authorId: "",
        minPrice: 0,
        maxPrice: 1000000,
        minRating: 0,
        inStock: false,
        sort: "newest",
    });
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null); // State for selected book
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(queryParams).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });
            
            const response = await axios.get(`${apiUrl}/product?${params.toString()}`);
            const { data } = response.data; 

            setBooks(data.products || []);
            setPagination(data.pagination || null);

        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sách:", error);
            setBooks([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }, [apiUrl, queryParams]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleFilterApply = (newFilters) => {
        setQueryParams(prev => ({
            ...prev,
            ...newFilters,
            page: 1,
        }));
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setQueryParams(prev => ({ ...prev, page: newPage }));
        }
    };

    // Handlers for popup
    const handleBookSelect = (book) => {
        setSelectedBook(book);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedBook(null);
    };

    return (
        <div className="booklist-page">
            <aside className="filter-section">
                <FilterSidebar onFilter={handleFilterApply} initialFilters={queryParams} />
            </aside>

            <main className="booklist-section">
                {loading ? (
                    <div className="loading-spinner">Đang tải...</div>
                ) : (
                    <>
                        {books.length > 0 ? (
                            <div className="booklist-grid">
                                {books.map((book) => (
                                    <Book key={book._id} book={book} onBookSelect={handleBookSelect} />
                                ))}
                            </div>
                        ) : (
                            <p className="no-result">Không tìm thấy sách phù hợp với yêu cầu của bạn.</p>
                        )}
                        {pagination && (
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </main>

            {/* Render popup conditionally */}
            {isPopupOpen && selectedBook && (
                <BookDetailPopup book={selectedBook} onClose={handleClosePopup} />
            )}
        </div>
    );
};

export default Booklist;
