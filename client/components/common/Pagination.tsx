"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalItems,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePageInputChange = (e: any) => {
    onPageChange(e.target.value);
  };

  const handlePageInputSubmit = (e: any) => {
    if (e.key === "Enter") {
      const pageNum = e.target.value;
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        onPageChange(pageNum);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
      <div className="text-sm text-gray-700">
        Showing{" "}
        <span className="font-medium">
          {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
        </span>{" "}
        to{" "}
        <span className="font-medium">
          {Math.min(currentPage * pageSize, totalItems)}
        </span>{" "}
        of <span className="font-medium">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border cursor-pointer border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Page</span>

          <input
            type="number"
            value={currentPage}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputSubmit}
            min={1}
            max={totalPages}
            className="w-16 px-2 py-1.5 text-center border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <span className="text-sm text-gray-700">of {totalPages}</span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border cursor-pointer border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
