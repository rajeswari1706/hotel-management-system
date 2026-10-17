import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../assets/styles/Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Build page numbers array
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // Show first, last, current, and +/- 1 of current
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      (i === currentPage - 2 && i > 1) ||
      (i === currentPage + 2 && i < totalPages)
    ) {
      pages.push('...');
    }
  }

  // Deduplicate consecutive ellipses
  const cleanPages = pages.filter((item, index) => {
    return item !== '...' || pages[index - 1] !== '...';
  });

  return (
    <nav className="pagination-container" aria-label="Hotel pagination">
      {/* Prev Button */}
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        title="Previous Page"
        aria-label="Previous Page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      {cleanPages.map((page, idx) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;
        return (
          <button
            key={page}
            className={`pagination-btn ${isCurrent ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        title="Next Page"
        aria-label="Next Page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
