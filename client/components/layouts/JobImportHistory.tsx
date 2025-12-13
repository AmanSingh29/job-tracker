'use client'

import { useState } from "react";
import { DataTable } from "../common/DataTable";
import { jobImportHistoryColumn } from "@/lib/tableColumns/jobImportHistoryTableColumn";

interface JobImportHistoryProps {
  data: any[];
}

export default function JobImportHistory({ data }: JobImportHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

        <DataTable
          data={data}
          columns={jobImportHistoryColumn}
          totalItems={40}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={4}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          onSort={handleSort}
        />
      </div>
    </div>
  );
}
