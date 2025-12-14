"use client";

import DateRangeFilter from "../common/DateRangeFilter";
import MultiSelectFilter from "../common/MultiSelectFilter";
import { SelectOption } from "@/types";

const statusOptions: SelectOption[] = [
  { label: "Success", value: "success" },
  { label: "Failed", value: "failed" },
];

const pageSizeOptions: SelectOption[] = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

interface FilterState {
  startDate: string;
  endDate: string;
  selectedStatuses: string;
  pageSize: number;
}

interface FilterSectionProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

export default function FilterSection({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DateRangeFilter
          startDate={filters.startDate}
          endDate={filters.endDate}
          onStartDateChange={(value) => onFilterChange({ startDate: value })}
          onEndDateChange={(value) => onFilterChange({ endDate: value })}
          label="Import Date"
          placeholder="Select date range"
        />

        <MultiSelectFilter
          options={statusOptions}
          selectedValues={[filters.selectedStatuses]}
          onChange={(value) =>
            onFilterChange({ selectedStatuses: String(value[0]) })
          }
          label="Status"
          placeholder="Select statuses"
          searchable={false}
          closeOnSelect
        />

        <MultiSelectFilter
          options={pageSizeOptions}
          selectedValues={[filters.pageSize]}
          onChange={(value) => onFilterChange({ pageSize: Number(value[0]) })}
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
