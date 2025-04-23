"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/services/auth.service";
import Swal from "sweetalert2";
import Link from "next/link";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    async function verifyUserEmail() {
      if (!token) {
        setError("未提供驗證令牌");
        setLoading(false);
        return;
      }
      
      try {
        const response = await verifyEmail(token);
        
        if (response.error) {
          setError(response.error);
          Swal.fire({
            title: "驗證失敗",
            text: response.error,
            icon: "error",
            confirmButtonText: "確定",
            confirmButtonColor: "#f97316",
          });
        } else {
          setVerified(true);
          Swal.fire({
            title: "驗證成功",
            text: "您的電子郵件已成功驗證",
            icon: "success",
            confirmButtonText: "前往登入",
            confirmButtonColor: "#f97316",
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/");
            }
          });
        }
      } catch (error) {
        console.error("電子郵件驗證錯誤:", error);
        setError("電子郵件驗證過程中發生錯誤");
        Swal.fire({
          title: "驗證錯誤",
          text: "電子郵件驗證過程中發生錯誤",
          icon: "error",
          confirmButtonText: "確定",
          confirmButtonColor: "#f97316",
        });
      } finally {
        setLoading(false);
      }
    }
    
    verifyUserEmail();
  }, [token, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-bold text-orange-700 mb-6">電子郵件驗證</h1>
        
        {loading && (
          <div className="my-8 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-orange-600 font-medium">正在驗證您的電子郵件...</p>
          </div>
        )}
        
        {!loading && verified && (
          <div className="my-8">
            <div className="bg-green-100 p-4 rounded-lg mb-6">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="text-green-700 font-medium">您的電子郵件已成功驗證！</p>
            </div>
            
            <Link href="/login" className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 shadow-md">
              前往登入
            </Link>
          </div>
        )}
        
        {!loading && error && (
          <div className="my-8">
            <div className="bg-red-100 p-4 rounded-lg mb-6">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <p className="text-red-700 font-medium">驗證失敗</p>
              <p className="text-red-600 mt-2">{error}</p>
            </div>
            
            <div className="space-y-3">
              <Link href="/login" className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 shadow-md">
                前往登入
              </Link>
              <p className="text-gray-600 mt-2">
                或 
                <Link href="/register" className="text-orange-600 hover:text-orange-700 ml-1">
                  創建新帳號
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen bg-orange-50">
        <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-orange-600 font-medium">載入中...</p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 