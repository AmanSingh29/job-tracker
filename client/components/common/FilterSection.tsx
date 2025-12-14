"use client";

import DateRangeFilter from "../common/DateRangeFilter";
import MultiSelectFilter from "../common/MultiSelectFilter";
import { SelectOption } from "@/types";

const statusOptions: SelectOption[] = [
  { label: "Success", value: "success" },
  { label: "Failed", value: "failed" },
];

const pageSizeOptions: SelectOption[] = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
  { label: "25", value: "25" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];

interface FilterSectionProps {
  startDate: string;
  endDate: string;
  selectedStatuses: (string | number)[];
  pageSize: number;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStatusesChange: (value: (string | number)[]) => void;
  onPageSizeChange: (value: (string | number)[]) => void;

  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function FilterSection({
  startDate,
  endDate,
  selectedStatuses,
  pageSize,
  onStartDateChange,
  onEndDateChange,
  onStatusesChange,
  onPageSizeChange,
  onApplyFilters,
  onClearFilters,
}: FilterSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onApply={onApplyFilters}
          label="Import Date"
          placeholder="Select date range"
        />

        <MultiSelectFilter
          options={statusOptions}
          selectedValues={selectedStatuses}
          onChange={onStatusesChange}
          label="Status"
          placeholder="Select statuses"
          searchable={false}
          closeOnSelect
        />

        <MultiSelectFilter
          options={pageSizeOptions}
          selectedValues={[pageSize]}
          onChange={onPageSizeChange}
          label="Page Size"
          placeholder="Select page size"
          searchable={false}
          closeOnSelect
        />

        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
