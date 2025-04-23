"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as authService from "@/services/auth.service";
import Swal from "sweetalert2";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("驗證令牌缺失");
        setVerifying(false);
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        
        if (response.error) {
          setError(response.error);
          setVerified(false);
        } else {
          setVerified(true);
        }
      } catch (err) {
        console.error("驗證郵件時出錯:", err);
        setError("無法驗證您的電子郵件。請稍後再試。");
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (!verifying) {
      if (verified) {
        Swal.fire({
          icon: 'success',
          title: '郵箱驗證成功',
          text: '您的電子郵件已成功驗證。現在您可以登入了。',
          confirmButtonColor: '#f97316',
        }).then(() => {
          router.push('/');
        });
      } else if (error) {
        Swal.fire({
          icon: 'error',
          title: '驗證失敗',
          text: error,
          confirmButtonColor: '#f97316',
        });
      }
    }
  }, [verifying, verified, error, router]);

  // 顯示加載或結果
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-orange-100 text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-center text-orange-500">
            郵箱驗證
          </h2>
          <p className="text-center text-gray-500">
            {verifying ? "正在驗證您的電子郵件..." : verified ? "驗證成功！" : "驗證失敗"}
          </p>
        </div>

        {verifying && (
          <div className="flex justify-center py-8">
            <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!verifying && (
          <div className="flex flex-col items-center space-y-6">
            <div className={`text-6xl ${verified ? 'text-green-500' : 'text-red-500'}`}>
              {verified ? '✓' : '✗'}
            </div>
            <p className="text-gray-600">
              {verified
                ? "您的電子郵件已成功驗證。"
                : `驗證失敗：${error}`}
            </p>
            <Link
              href="/"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
            >
              返回登入
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 