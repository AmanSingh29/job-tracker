"use client";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full bg-white">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <div
                      className="h-4 bg-gray-200 rounded"
                      style={{
                        width: `${60 + Math.random() * 40}%`,
                      }}
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
