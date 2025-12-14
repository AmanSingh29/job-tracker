"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "../common/DataTable";
import { jobImportHistoryColumn } from "@/lib/tableColumns/jobImportHistoryTableColumn";
import Pagination from "../common/Pagination";
import { getJobImportHistoryServerAction } from "@/serverActions/getJobImportHistory";
import { TableSkeleton } from "../loaders/TableSkeleton";
import FilterSection from "../common/FilterSection";

interface JobImportHistoryProps {
  data: any;
}

interface FilterState {
  startDate: string;
  endDate: string;
  selectedStatuses: string;
  pageSize: number;
  currentPage: number;
  sort_by?: string;
  sort_order?: string;
}

export default function JobImportHistory({ data }: JobImportHistoryProps) {
  const [filters, setFilters] = useState<FilterState>({
    startDate: "",
    endDate: "",
    selectedStatuses: "",
    pageSize: data.limit || 10,
    currentPage: data.page,
    sort_by: "created_at",
    sort_order: "descending",
  });

  const [historyData, setHistoryData] = useState<any[]>(data?.data || []);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await getJobImportHistoryServerAction({
      page: filters.currentPage,
      limit: filters.pageSize,
      start_date: filters.startDate || undefined,
      end_date: filters.endDate || undefined,
      status: filters.selectedStatuses || undefined,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    });
    const { data } = response;
    setHistoryData(data);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const updateFilter = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      ...(updates.currentPage === undefined && { currentPage: 1 }),
    }));
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({
      startDate: "",
      endDate: "",
      selectedStatuses: "",
      pageSize: prev.pageSize,
      currentPage: 1,
    }));
  };

  const handleSort = (key: string, direction: "ascending" | "descending") => {
    updateFilter({
      sort_by: key,
      sort_order: direction,
      currentPage: filters.currentPage,
    });
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
          filters={filters}
          onFilterChange={updateFilter}
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
            currentPage={filters.currentPage}
            pageSize={filters.pageSize}
            totalPages={Math.ceil(data.total / filters.pageSize)}
            onPageChange={(page) => updateFilter({ currentPage: page })}
          />
        </div>
      </div>
    </div>
  );
}
