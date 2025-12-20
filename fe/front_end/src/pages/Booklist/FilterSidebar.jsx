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
            <input
                type="text"
                name="search"
                placeholder="Tìm kiếm sách..."
                className="search-input"
                value={filters.search}
                onChange={handleInputChange}
            />

            <h4>Sắp xếp</h4>
            <select name="sort" value={filters.sort} onChange={handleInputChange}>
                {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>

            <h4>Thể loại</h4>
            <select name="categoryId" value={filters.categoryId} onChange={handleInputChange}>
                <option value="">Tất cả thể loại</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>

            <h4>Tác giả</h4>
            <select name="authorId" value={filters.authorId} onChange={handleInputChange}>
                <option value="">Tất cả tác giả</option>
                {authors.map(author => <option key={author._id} value={author._id}>{author.name}</option>)}
            </select>

            <h4>Khoảng giá</h4>
            <input
                type="range"
                min="0"
                max="1000000"
                value={filters.maxPrice}
                onChange={handleSliderChange}
                className="price-slider"
            />
            <div className="price-range">
                <span>{filters.minPrice.toLocaleString()}đ</span> - <span>{filters.maxPrice.toLocaleString()}đ</span>
            </div>

            <h4>Đánh giá tối thiểu</h4>
            <select name="minRating" value={filters.minRating} onChange={handleInputChange}>
                <option value="0">Tất cả</option>
                <option value="4">Từ 4 sao</option>
                <option value="3">Từ 3 sao</option>
                <option value="2">Từ 2 sao</option>
                <option value="1">Từ 1 sao</option>
            </select>

            <label className="in-stock-label">
                <input
                    type="checkbox"
                    name="inStock"
                    checked={filters.inStock}
                    onChange={handleInputChange}
                />
                Chỉ hiển thị sản phẩm còn hàng
            </label>

            <div className="filter-actions">
                <button className="apply-btn" onClick={applyFilter}>
                    Áp dụng
                </button>
                <button className="clear-btn" onClick={clearFilters}>
                    Xóa bộ lọc
                </button>
            </div>
        </div>
    );
};

export default FilterSidebar;
