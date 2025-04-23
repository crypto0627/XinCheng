"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function FormSelect({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  placeholder,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set the selected label based on the value
  useEffect(() => {
    const option = options.find(opt => opt.value === value);
    setSelectedLabel(option ? option.label : placeholder || "");
  }, [value, options, placeholder]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    // Create a synthetic event to mimic select onChange
    const syntheticEvent = {
      target: {
        name,
        value: optionValue
      }
    } as unknown as ChangeEvent<HTMLSelectElement>;
    
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        {/* Hidden select for form submission */}
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="sr-only"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full text-left px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white ${
            disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "text-gray-700 cursor-pointer"
          }`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <span className={value ? "" : "text-gray-400"}>
            {selectedLabel}
          </span>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>
        
        {/* Dropdown options */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {placeholder && (
              <div
                className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-gray-400"
                onClick={() => handleOptionClick("")}
              >
                {placeholder}
              </div>
            )}
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 hover:bg-orange-50 cursor-pointer flex items-center justify-between ${
                  option.value === value ? "bg-orange-100" : ""
                }`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
                {option.value === value && <Check className="h-4 w-4 text-orange-500" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 