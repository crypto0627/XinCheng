"use client";

import { ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "password";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
}

export default function FormInput({
  id,
  name,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  showPassword,
  togglePasswordVisibility,
}: FormInputProps) {
  const isPasswordField = type === "password" && togglePasswordVisibility;
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          required={required}
          placeholder={placeholder}
          disabled={disabled}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={disabled}
            aria-label='show-password'
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
} 