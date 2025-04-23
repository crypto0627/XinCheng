"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemCount: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemCount,
  onPageChange,
  isLoading,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-500">
        顯示 {itemCount} 筆訂單，共 {totalItems} 筆
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1 || isLoading}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === 1 || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-orange-100 text-orange-500 hover:bg-orange-200"
          }`}
        >
          上一頁
        </button>
        <span className="px-3 py-1 text-sm">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || isLoading}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === totalPages || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-orange-100 text-orange-500 hover:bg-orange-200"
          }`}
        >
          下一頁
        </button>
      </div>
    </div>
  );
} 