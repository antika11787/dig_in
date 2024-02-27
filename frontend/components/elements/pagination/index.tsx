import React, { useState } from "react";
import "./index.scss";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  setPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPage(newPage);
    }
  };

  const generatePageNumbers = () => {
    const maxButtonsToShow = 5;
    const middleButtonIndex = Math.floor(maxButtonsToShow / 2);
    let startPage: number;

    switch (true) {
      case totalPages <= maxButtonsToShow:
        startPage = 1;
        break;
      case currentPage <= middleButtonIndex + 1:
        startPage = 1;
        break;
      case currentPage >= totalPages - middleButtonIndex:
        startPage = totalPages - maxButtonsToShow + 1;
        break;
      default:
        startPage = currentPage - middleButtonIndex;
    }
    const endPage = Math.min(startPage + maxButtonsToShow - 1, totalPages);
    return Array.from({ length: endPage - startPage + 1 }, (_, index) => {
      const pageNumber = startPage + index;
      return (
        <button
          key={pageNumber}
          className={`pagination-btn ${
            currentPage === pageNumber ? "active-page" : ""
          }`}
          onClick={() => handlePageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      );
    });
  };

  return (
    <div className="pagination-btn-group">
      <button
        className="pagination-btn"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {generatePageNumbers()}
      <button
        className="pagination-btn"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
