import { useEffect, useRef, useState } from 'react'

interface ToggleBoxProps<T> {
  value: T
  options: { value: T; label: string }[]
  displayText: (value: T) => string
  onSelect: (value: T) => void
  className?: string
}

export default function ToggleBox<T>({
  value,
  options,
  displayText,
  onSelect,
  className = ''
}: ToggleBoxProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 點擊外部關閉下拉選單邏輯
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 border border-gray-300 rounded-md bg-white text-black flex items-center justify-between min-w-[120px] w-full"
      >
        <span>{displayText(value)}</span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-full bg-white border border-gray-300 text-black rounded-md shadow-lg z-10">
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={String(option.value)}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${value === option.value ? 'bg-gray-100' : ''}`}
                onClick={() => {
                  onSelect(option.value)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
