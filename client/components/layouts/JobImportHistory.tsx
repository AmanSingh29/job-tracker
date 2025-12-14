"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "../common/DataTable";
import { jobImportHistoryColumn } from "@/lib/tableColumns/jobImportHistoryTableColumn";
import Pagination from "../common/Pagination";
import { getJobImportHistoryServerAction } from "@/serverActions/getJobImportHistory";
import { TableSkeleton } from "../loaders/TableSkeleton";
import { SelectOption } from "@/types";
import FilterSection from "../common/FilterSection";

interface JobImportHistoryProps {
  data: any;
}

export default function JobImportHistory({ data }: JobImportHistoryProps) {
  const [currentPage, setCurrentPage] = useState(data.page);
  const [pageSize, setPageSize] = useState(data.limit || 10);
  const [historyData, setHistoryData] = useState<any[]>(data?.data || []);
  const [loading, setLoading] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedStatuses, setSelectedStatuses] = useState<(string | number)[]>(
    []
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await getJobImportHistoryServerAction({
      page: currentPage,
      limit: pageSize,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    });
    const { data } = response;
    setHistoryData(data);
    setLoading(false);
  }, [currentPage, pageSize, startDate, endDate, selectedStatuses]);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedStatuses([]);
    setCurrentPage(1);
  };

  const handleSort = (key: string, direction: "asc" | "desc") => {
    console.log("Sort by:", key, direction);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Job Import History
            </h1>
            <p className="text-gray-600 mt-1">
              Track and monitor job import operations
            </p>
          </div>
          <div className="flex mb-2 flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-1">
            <div className="text-lg text-gray-700 font-medium">
              Total Records: <span className="text-blue-600">{data.total}</span>
            </div>
          </div>
        </div>

        <FilterSection
          startDate={startDate}
          endDate={endDate}
          selectedStatuses={selectedStatuses}
          pageSize={pageSize}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onStatusesChange={setSelectedStatuses}
          onPageSizeChange={setPageSize}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        {loading ? (
          <TableSkeleton columns={5} rows={10} />
        ) : (
          <div className="">
            <DataTable
              data={historyData}
              columns={jobImportHistoryColumn}
              onSort={handleSort}
            />
          </div>
        )}

        <div className="mt-2">
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
