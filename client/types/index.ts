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
  onSort?: (key: string, direction: "asc" | "desc") => void;
}

export interface SortState {
  key: string | null;
  direction: "asc" | "desc" | null;
}
