"use client";

import { useState, useRef, useEffect } from "react";
import { TimeRange } from "@/stores/useOrderStore";
import { FiClock, FiChevronDown, FiChevronUp } from "react-icons/fi";

type TimeRangeSelectorProps = {
  timeRange: TimeRange;
  onTimeRangeChange: (timeRange: TimeRange) => void;
  loading: boolean;
  orderStats: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  } | null;
};

export function TimeRangeSelector({
  timeRange,
  onTimeRangeChange,
  loading,
  orderStats
}: TimeRangeSelectorProps) {
  // 時間範圍選項
  const timeRangeOptions: { label: string; value: TimeRange }[] = [
    { label: "本日", value: "今日" },
    { label: "本週", value: "本週" },
    { label: "本月", value: "本月" },
    { label: "本季", value: "本季" },
    { label: "本年", value: "本年" },
    { label: "所有", value: "all" },
  ];

  // 下拉選單狀態
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 切換下拉選單
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 選擇時間範圍
  const handleSelectTimeRange = (value: TimeRange) => {
    onTimeRangeChange(value);
    setIsDropdownOpen(false);
  };

  // 獲取當前選中的時間範圍選項
  const selectedOption = timeRangeOptions.find(option => option.value === timeRange);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {/* 時間範圍選擇器 */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center justify-between p-2 border border-gray-300 rounded-md cursor-pointer hover:border-orange-500"
          onClick={toggleDropdown}
        >
          <div className="flex items-center">
            <FiClock className="text-gray-500 mr-2" />
            <span>{selectedOption?.label || "選擇時間範圍"}</span>
          </div>
          {isDropdownOpen ? (
            <FiChevronUp className="text-gray-500" />
          ) : (
            <FiChevronDown className="text-gray-500" />
          )}
        </div>

        {isDropdownOpen && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
            {timeRangeOptions.map((option) => (
              <div
                key={option.value}
                className={`p-2 cursor-pointer hover:bg-orange-50 ${
                  option.value === timeRange
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-800"
                }`}
                onClick={() => handleSelectTimeRange(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 快速選擇按鈕 */}
      <div className="mt-3 flex space-x-2 bg-gray-100 p-1 rounded-lg">
        {(["今日", "本週", "本月"] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => onTimeRangeChange(range)}
            className={`flex-1 py-2 text-sm font-medium rounded-md ${
              timeRange === range
                ? "bg-orange-500 text-white"
                : "text-gray-500 hover:bg-gray-200"
            }`}
            aria-label='range'
          >
            {range}
          </button>
        ))}
      </div>
      
      {/* 訂單統計 */}
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">總訂單數</p>
          {loading ? (
            <p className="text-2xl font-bold text-orange-500">載入中...</p>
          ) : (
            <p className="text-2xl font-bold text-orange-500">{orderStats?.total || 0}</p>
          )}
        </div>
        
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-orange-50 p-2 rounded-lg">
            <p className="text-xs text-gray-500">待出貨</p>
            <p className="text-lg font-bold text-orange-500">
              {loading ? "..." : orderStats?.pending || 0}
            </p>
          </div>
          <div className="bg-green-50 p-2 rounded-lg">
            <p className="text-xs text-gray-500">已完成</p>
            <p className="text-lg font-bold text-green-500">
              {loading ? "..." : orderStats?.completed || 0}
            </p>
          </div>
          <div className="bg-red-50 p-2 rounded-lg">
            <p className="text-xs text-gray-500">已取消</p>
            <p className="text-lg font-bold text-red-500">
              {loading ? "..." : orderStats?.cancelled || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 