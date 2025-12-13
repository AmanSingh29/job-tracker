"use client";

import { SortState, TableProps } from "@/types";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  totalItems,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onSort,
  isLoading = false,
}: TableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({
    key: null,
    direction: null,
  });
  const [pageInput, setPageInput] = useState(currentPage.toString());

  const handleSort = (columnKey: string) => {
    if (!onSort) return;

    let newDirection: "asc" | "desc" = "asc";

    if (sortState.key === columnKey) {
      newDirection = sortState.direction === "asc" ? "desc" : "asc";
    }

    setSortState({ key: columnKey, direction: newDirection });
    onSort(columnKey, newDirection);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const page = parseInt(pageInput);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      } else {
        setPageInput(currentPage.toString());
      }
    }
  };

  const handlePageInputBlur = () => {
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const getSortIcon = (columnKey: string) => {
    if (sortState.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortState.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Header with total count and page size */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-1">
        <div className="text-sm text-gray-700 font-medium">
          Total Records: <span className="text-blue-600">{totalItems}</span>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="pageSize"
            className="text-sm text-gray-700 whitespace-nowrap"
          >
            Rows per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full bg-white">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                    column.sortable && onSort
                      ? "cursor-pointer select-none hover:bg-gray-100"
                      : ""
                  } ${column.className || ""}`}
                  onClick={() =>
                    column.sortable && onSort && handleSort(column.key)
                  }
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && onSort && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 text-sm text-gray-900 ${
                        column.className || ""
                      }`}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
        <div className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">
            {data.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
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
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Page</span>
            <input
              type="number"
              value={pageInput}
              onChange={handlePageInputChange}
              onKeyDown={handlePageInputSubmit}
              onBlur={handlePageInputBlur}
              min={1}
              max={totalPages}
              className="w-16 px-2 py-1.5 text-center border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-700">of {totalPages}</span>
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
