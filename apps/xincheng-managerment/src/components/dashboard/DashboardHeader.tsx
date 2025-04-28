"use client";

import { FiLogOut } from "react-icons/fi";

type DashboardHeaderProps = {
  onLogout: () => void;
};

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {

  return (
    <div className="bg-white px-4 py-3 shadow-sm sticky top-0 z-10 flex justify-between items-center">
      <h1 className="font-bold text-orange-500 text-xl">儀表板</h1>
      <div className="flex gap-2">
        <button
          onClick={onLogout}
          className="bg-orange-100 hover:bg-orange-200 text-orange-500 px-3 py-1 rounded-md text-sm font-medium flex items-center"
          aria-label='logout'
        >
          <FiLogOut className="mr-1" />
          登出
        </button>
      </div>
    </div>
  );
} 