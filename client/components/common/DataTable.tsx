"use client";

import { SortState, TableProps } from "@/types";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onSort,
}: TableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({
    key: null,
    direction: null,
  });

  const handleSort = (columnKey: string) => {
    if (!onSort) return;

    let newDirection: "asc" | "desc" = "asc";

    if (sortState.key === columnKey) {
      newDirection = sortState.direction === "asc" ? "desc" : "asc";
    }

    setSortState({ key: columnKey, direction: newDirection });
    onSort(columnKey, newDirection);
  };

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
            {data.length === 0 ? (
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
    </div>
  );
}
