"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "../common/DataTable";
import { jobImportHistoryColumn } from "@/lib/tableColumns/jobImportHistoryTableColumn";
import Pagination from "../common/Pagination";
import { getJobImportHistoryServerAction } from "@/serverActions/getJobImportHistory";
import { TableSkeleton } from "../loaders/TableSkeleton";

interface JobImportHistoryProps {
  data: any;
}

export default function JobImportHistory({ data }: JobImportHistoryProps) {
  const [currentPage, setCurrentPage] = useState(data.page);
  const [pageSize, setPageSize] = useState(data.limit || 10);
  const [historyData, setHistoryData] = useState<any[]>(data?.data || []);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await getJobImportHistoryServerAction({
      page: currentPage,
      limit: pageSize,
    });
    const { data } = response;
    setHistoryData(data);
    setLoading(false);
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const handleSort = (key: string, direction: "asc" | "desc") => {
    console.log("Sort by:", key, direction);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Job Import History
          </h1>
          <p className="text-gray-600 mt-1">
            Track and monitor job import operations
          </p>
        </div>
        <div className="flex mb-2 flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-1">
          <div className="text-sm text-gray-700 font-medium">
            Total Records: <span className="text-blue-600">{data.total}</span>
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
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 cursor-pointer py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        {loading ? (
          <TableSkeleton columns={5} rows={10} />
        ) : (
          <DataTable
            data={historyData}
            columns={jobImportHistoryColumn}
            onSort={handleSort}
          />
        )}

        <div className="mt-4">
          <Pagination
            totalItems={data.total}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={Math.ceil(data.total / pageSize)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
