"use client";
import { useState, useRef, useEffect } from "react";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface MultiSelectFilterProps {
  options: SelectOption[];
  selectedValues: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  onApply?: () => void;
  onClear?: () => void;
  label?: string;
  placeholder?: string;
  className?: string;
  searchable?: boolean;
  mode?: "multi" | "single";
  closeOnSelect?: boolean;
}

export default function MultiSelectFilter({
  options,
  selectedValues,
  onChange,
  onApply,
  onClear,
  label = "Filter",
  placeholder = "Select options",
  className = "",
  searchable = true,
  mode = "single",
  closeOnSelect = false,
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleToggle = (value: string | number) => {
    if (mode === "single") {
      onChange([value]);
      if (closeOnSelect || closeOnSelect === undefined) {
        setIsOpen(false);
      }
    } else {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      onChange(newValues);
      if (closeOnSelect) {
        setIsOpen(false);
      }
    }
  };

  const handleSelectAll = () => {
    onChange(options.map((opt) => opt.value));
  };

  const handleClearAll = () => {
    onChange([]);
    if (onClear) onClear();
  };

  const handleApply = () => {
    if (onApply) onApply();
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const selected = options.find(
        (opt) => String(opt.value) === String(selectedValues[0])
      );
      return selected?.label || placeholder;
    }
    return `${selectedValues.length} selected`;
  };

  const showBulkActions = mode === "multi";
  const showActionButtons = mode === "multi" || onApply || onClear;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full cursor-pointer px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center justify-between"
      >
        <span
          className={`text-sm ${
            selectedValues.length > 0 ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {getDisplayText()}
        </span>
        <div className="flex items-center gap-2">
          {mode === "multi" && selectedValues.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              {selectedValues.length}
            </span>
          )}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-3">
            {searchable && (
              <div className="mb-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {showBulkActions && (
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}

            <div
              className={`max-h-64 overflow-y-auto ${
                showBulkActions ? "border-t border-gray-200 pt-2" : ""
              }`}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center px-2 py-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                  >
                    <input
                      type={mode === "single" ? "radio" : "checkbox"}
                      checked={selectedValues.includes(option.value)}
                      onChange={() => handleToggle(option.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))
              ) : (
                <div className="py-4 text-center text-sm text-gray-500">
                  No options found
                </div>
              )}
            </div>

            {showActionButtons && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
