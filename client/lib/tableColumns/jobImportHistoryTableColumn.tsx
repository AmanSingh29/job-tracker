"use client";

import ClientDate from "@/components/common/ClientDate";
import { formatDate } from "../common";

export const jobImportHistoryColumn: any[] = [
  {
    key: "_id",
    label: "ID",
    sortable: true,
    render: (value: string) => (
      <span className="font-mono text-xs">{value.slice(-8)}</span>
    ),
  },
  {
    key: "created_at",
    label: "Imported At",
    sortable: true,
    render: (value: string) => <ClientDate value={value} />,
  },
  {
    key: "total_fetched",
    label: "Fetched",
    sortable: true,
    className: "text-center",
    render: (value: number) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {value}
      </span>
    ),
  },
  {
    key: "total_imported",
    label: "Imported",
    sortable: true,
    className: "text-center",
    render: (value: number) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {value || 0}
      </span>
    ),
  },
  {
    key: "new_jobs",
    label: "New",
    sortable: true,
    className: "text-center",
    render: (value: number) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        {value || 0}
      </span>
    ),
  },
  {
    key: "updated_jobs",
    label: "Updated",
    sortable: true,
    className: "text-center",
    render: (value: number) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        {value || 0}
      </span>
    ),
  },
  {
    key: "failed_jobs_count",
    label: "Failed",
    sortable: true,
    className: "text-center",
    render: (value: number) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value > 0 ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
        }`}
      >
        {value}
      </span>
    ),
  },
];
