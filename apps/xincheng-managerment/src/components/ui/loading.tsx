import React from 'react';

interface LoadingProps {
  message?: string;
}

/**
 * 全屏加載組件
 */
export const FullScreenLoading: React.FC<LoadingProps> = ({ message = '載入中...' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-medium text-gray-700">{message}</h2>
      </div>
    </div>
  );
};

/**
 * 內聯加載組件
 */
export const InlineLoading: React.FC<LoadingProps> = ({ message = '載入中...' }) => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="w-10 h-10 border-3 border-orange-400 border-t-transparent rounded-full animate-spin mr-3"></div>
      <p className="text-orange-600 font-medium">{message}</p>
    </div>
  );
}; 