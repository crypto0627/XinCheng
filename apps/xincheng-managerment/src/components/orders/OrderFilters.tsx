"use client";

import { useState, useRef, useEffect } from "react";
import { TimeRange } from "@/stores/useOrderStore";
import { FiClock, FiFilter, FiChevronDown, FiChevronUp } from "react-icons/fi";

type TimeRangeOption = {
  label: string;
  value: TimeRange;
};

type StatusOption = {
  label: string;
  value: string;
};

type OrderFiltersProps = {
  timeRange: TimeRange;
  statusFilter: string;
  onTimeRangeChange: (value: TimeRange) => void;
  onStatusFilterChange: (value: string) => void;
  timeRangeOptions: TimeRangeOption[];
  statusOptions: StatusOption[];
};

export function OrderFilters({
  timeRange,
  statusFilter,
  onTimeRangeChange,
  onStatusFilterChange,
  timeRangeOptions,
  statusOptions,
}: OrderFiltersProps) {
  // 時間範圍下拉選單
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const timeDropdownRef = useRef<HTMLDivElement>(null);

  // 狀態過濾下拉選單
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timeDropdownRef.current &&
        !timeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTimeDropdownOpen(false);
      }
      
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 獲取當前選中選項的標籤
  const selectedTimeOption = timeRangeOptions.find(
    (option) => option.value === timeRange
  );
  
  const selectedStatusOption = statusOptions.find(
    (option) => option.value === statusFilter
  ) || { label: "所有狀態", value: "all" };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* 時間範圍選擇器 */}
        <div className="flex-1" ref={timeDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">時間範圍</label>
          <div
            className={`flex items-center justify-between px-3 py-2 border border-gray-300 bg-white rounded-md cursor-pointer hover:border-orange-500 ${
              isTimeDropdownOpen ? "border-orange-500 ring-2 ring-orange-200" : ""
            }`}
            onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
          >
            <div className="flex items-center">
              <FiClock className="text-gray-500 mr-2" />
              <span>{selectedTimeOption?.label || "請選擇時間範圍"}</span>
            </div>
            {isTimeDropdownOpen ? (
              <FiChevronUp className="text-gray-500" />
            ) : (
              <FiChevronDown className="text-gray-500" />
            )}
          </div>

          {isTimeDropdownOpen && (
            <div className="absolute z-20 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              {timeRangeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-3 py-2 cursor-pointer hover:bg-orange-50 ${
                    option.value === timeRange ? "bg-orange-100 text-orange-600 font-medium" : "text-gray-800"
                  }`}
                  onClick={() => {
                    onTimeRangeChange(option.value);
                    setIsTimeDropdownOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 狀態過濾器 */}
        <div className="flex-1" ref={statusDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">訂單狀態</label>
          <div
            className={`flex items-center justify-between px-3 py-2 border border-gray-300 bg-white rounded-md cursor-pointer hover:border-orange-500 ${
              isStatusDropdownOpen ? "border-orange-500 ring-2 ring-orange-200" : ""
            }`}
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
          >
            <div className="flex items-center">
              <FiFilter className="text-gray-500 mr-2" />
              <span>{selectedStatusOption.label}</span>
            </div>
            {isStatusDropdownOpen ? (
              <FiChevronUp className="text-gray-500" />
            ) : (
              <FiChevronDown className="text-gray-500" />
            )}
          </div>

          {isStatusDropdownOpen && (
            <div className="absolute z-20 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <div
                className={`px-3 py-2 cursor-pointer hover:bg-orange-50 ${
                  statusFilter === "all" ? "bg-orange-100 text-orange-600 font-medium" : "text-gray-800"
                }`}
                onClick={() => {
                  onStatusFilterChange("all");
                  setIsStatusDropdownOpen(false);
                }}
              >
                所有狀態
              </div>
              
              {statusOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-3 py-2 cursor-pointer hover:bg-orange-50 ${
                    option.value === statusFilter ? "bg-orange-100 text-orange-600 font-medium" : "text-gray-800"
                  }`}
                  onClick={() => {
                    onStatusFilterChange(option.value);
                    setIsStatusDropdownOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 