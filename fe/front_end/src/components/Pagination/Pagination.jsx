import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    // Define the range of page numbers to display
    let startPage, endPage;
    if (totalPages <= 5) {
        // Less than 5 total pages so show all
        startPage = 1;
        endPage = totalPages;
    } else {
        // More than 5 total pages so calculate start and end pages
        if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage + 1 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) {
        return null; // Don't render pagination if there's only one page
    }

    return (
        <nav className="pagination-container">
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button onClick={() => onPageChange(currentPage - 1)} className="page-link" disabled={currentPage === 1}>
                        &laquo;
                    </button>
                </li>
                {startPage > 1 && (
                     <li className="page-item disabled"><span className="page-link">...</span></li>
                )}
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => onPageChange(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
                 {endPage < totalPages && (
                    <li className="page-item disabled"><span className="page-link">...</span></li>
                )}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button onClick={() => onPageChange(currentPage + 1)} className="page-link" disabled={currentPage === totalPages}>
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
