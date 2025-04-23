"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
};

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "請選擇",
  className = "",
  label,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 獲取當前選中選項的標籤
  const selectedOption = options.find((option) => option.value === value);

  // 點擊外部關閉下拉選單
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 選擇一個選項
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        className={`flex items-center justify-between px-3 py-2 border border-gray-300 bg-white rounded-md cursor-pointer hover:border-orange-500 ${
          isOpen ? "border-orange-500 ring-2 ring-orange-200" : ""
        } ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${!selectedOption ? "text-gray-400" : "text-gray-800"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {isOpen ? (
          <FiChevronUp className="text-gray-500" />
        ) : (
          <FiChevronDown className="text-gray-500" />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-3 py-2 cursor-pointer hover:bg-orange-50 ${
                option.value === value ? "bg-orange-100 text-orange-600 font-medium" : "text-gray-800"
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 