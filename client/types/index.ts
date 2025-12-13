export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  isLoading?: boolean;
}

export interface SortState {
  key: string | null;
  direction: "asc" | "desc" | null;
}
