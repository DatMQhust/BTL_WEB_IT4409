import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FilterSidebar.css";

const FilterSidebar = ({ onFilter, initialFilters }) => {
    // State for filter values, initialized from props
    const [filters, setFilters] = useState({
        search: initialFilters.search || "",
        categoryId: initialFilters.categoryId || "",
        authorId: initialFilters.authorId || "",
        minPrice: initialFilters.minPrice || 0,
        maxPrice: initialFilters.maxPrice || 1000000,
        minRating: initialFilters.minRating || 0,
        inStock: initialFilters.inStock || false,
        sort: initialFilters.sort || "newest",
    });

    // State for data fetched from API
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);

    const apiUrl = import.meta.env.VITE_API_URL;

    // Fetch categories and authors on component mount
    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [catRes, authorRes] = await Promise.all([
                    axios.get(`${apiUrl}/category`),
                    axios.get(`${apiUrl}/author?limit=1000`), // Fetch all authors
                ]);
                setCategories(catRes.data.data.categories);
                setAuthors(authorRes.data.data.authors);
            } catch (error) {
                console.error("Failed to fetch filter data:", error);
            }
        };
        fetchFilterData();
    }, [apiUrl]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSliderChange = (e) => {
        setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }));
    };

    const applyFilter = () => {
        onFilter(filters);
    };

    const clearFilters = () => {
        const cleared = {
            search: "", categoryId: "", authorId: "", minPrice: 0,
            maxPrice: 1000000, minRating: 0, inStock: false, sort: "newest"
        };
        setFilters(cleared);
        onFilter(cleared);
    }

    const sortOptions = [
        { value: "newest", label: "Mới nhất" },
        { value: "bestseller", label: "Bán chạy nhất" },
        { value: "price_asc", label: "Giá: Thấp đến Cao" },
        { value: "price_desc", label: "Giá: Cao đến Thấp" },
        { value: "rating", label: "Đánh giá cao nhất" },
        { value: "name", label: "Tên: A-Z" },
    ];

    return (
        <div className="filter-sidebar">
            <div className="filter-header">
                <h3 className="filter-title">
                    <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Bộ lọc tìm kiếm
                </h3>
            </div>

            <div className="filter-section">
                <div className="search-wrapper">
                    <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        name="search"
                        placeholder="Tìm kiếm sách..."
                        className="search-input"
                        value={filters.search}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="filter-section">
                <h4 className="section-title">
                    <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Sắp xếp
                </h4>
                <select name="sort" value={filters.sort} onChange={handleInputChange} className="filter-select">
                    {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>

            <div className="filter-section">
                <h4 className="section-title">
                    <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Thể loại
                </h4>
                <select name="categoryId" value={filters.categoryId} onChange={handleInputChange} className="filter-select">
                    <option value="">Tất cả thể loại</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
            </div>

            <div className="filter-section">
                <h4 className="section-title">
                    <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Tác giả
                </h4>
                <select name="authorId" value={filters.authorId} onChange={handleInputChange} className="filter-select">
                    <option value="">Tất cả tác giả</option>
                    {authors.map(author => <option key={author._id} value={author._id}>{author.name}</option>)}
                </select>
            </div>

            <div className="filter-section">
                <h4 className="section-title">
                    <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Khoảng giá
                </h4>
                <div className="price-slider-container">
                    <input
                        type="range"
                        min="0"
                        max="1000000"
                        value={filters.maxPrice}
                        onChange={handleSliderChange}
                        className="price-slider"
                    />
                    <div className="price-range">
                        <span className="price-badge">{filters.minPrice.toLocaleString()}đ</span>
                        <span className="price-badge">{filters.maxPrice.toLocaleString()}đ</span>
                    </div>
                </div>
            </div>

            <div className="filter-section">
                <h4 className="section-title">
                    <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Đánh giá
                </h4>
                <select name="minRating" value={filters.minRating} onChange={handleInputChange} className="filter-select">
                    <option value="0">Tất cả đánh giá</option>
                    <option value="4">⭐ 4 sao trở lên</option>
                    <option value="3">⭐ 3 sao trở lên</option>
                    <option value="2">⭐ 2 sao trở lên</option>
                    <option value="1">⭐ 1 sao trở lên</option>
                </select>
            </div>

            <div className="filter-section">
                <label className="in-stock-label">
                    <input
                        type="checkbox"
                        name="inStock"
                        checked={filters.inStock}
                        onChange={handleInputChange}
                        className="checkbox-input"
                    />
                    <span className="checkbox-text">
                        <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Chỉ hiển thị sản phẩm còn hàng
                    </span>
                </label>
            </div>

            <div className="filter-actions">
                <button className="apply-btn" onClick={applyFilter}>
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Áp dụng
                </button>
                <button className="clear-btn" onClick={clearFilters}>
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Xóa bộ lọc
                </button>
            </div>
        </div>
    );
};

export default FilterSidebar;
