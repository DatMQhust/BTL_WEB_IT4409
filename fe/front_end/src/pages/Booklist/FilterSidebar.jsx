import React, { useState } from "react";
import "./FilterSidebar.css";

const FilterSidebar = ({ onFilter }) => {
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [category, setCategory] = useState("");

  const applyFilter = () => {
    onFilter({ category, minPrice, maxPrice, keyword });
  };

  return (
    <div className="filter-sidebar">
      <input
        type="text"
        placeholder="Tìm kiếm sách..."
        className="search-input"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <h4>Thể loại</h4>
      <label>
        <input type="radio" name="cat" onChange={() => setCategory("phi_hu_cau")} /> Phi hư cấu
      </label>
      <label>
        <input type="radio" name="cat" onChange={() => setCategory("hu_cau")} /> Hư cấu
      </label>
      <label>
        <input type="radio" name="cat" onChange={() => setCategory("thieu_nhi")} /> Thiếu nhi
      </label>

      <h4>Khoảng giá</h4>
      <input
        type="range"
        min="0"
        max="1000000"
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
      />
      <div className="price-range">
        <span>{minPrice}</span> - <span>{maxPrice}</span>
      </div>

      <button className="apply-btn" onClick={applyFilter}>
        Áp dụng
      </button>
    </div>
  );
};

export default FilterSidebar;
