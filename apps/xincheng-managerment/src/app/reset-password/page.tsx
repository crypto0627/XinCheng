"use client";

import { Suspense, lazy, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as authService from "@/services/auth.service";
import Swal from "sweetalert2";
import Link from "next/link";

// Lazy load components
const FormInput = lazy(() => import("@/components/auth/FormInput"));
const SubmitButton = lazy(() => import("@/components/auth/SubmitButton"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 rounded mb-4"></div>
    <div className="h-10 bg-gray-200 rounded mb-4"></div>
    <div className="h-10 bg-orange-200 rounded"></div>
  </div>
);

// 主要內容組件
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    // 檢查 URL 中是否存在令牌
    if (!token) {
      setTokenError(true);
      Swal.fire({
        icon: 'error',
        title: '無效的重置鏈接',
        text: '您的密碼重置鏈接無效或已過期。',
        confirmButtonColor: '#f97316',
      }).then(() => {
        router.push('/forgot-password');
      });
    }
  }, [token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const showError = (message: string) => {
    Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: message,
      confirmButtonColor: '#f97316', // orange-500
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      showError("密碼不匹配");
      return;
    }
    
    if (formData.newPassword.length < 6) {
      showError("密碼必須至少包含 6 個字符");
      return;
    }
    
    setLoading(true);

    try {
      // 調用重置密碼 API
      const response = await authService.resetPassword({
        token: token as string,
        newPassword: formData.newPassword,
      });

      if (response.error) {
        showError(response.error);
        return;
      }

      await Swal.fire({
        icon: 'success',
        title: '密碼已重置',
        text: '您的密碼已成功重置，現在可以使用新密碼登入。',
        confirmButtonColor: '#f97316',
      });

      // 重定向到登入頁面
      router.push('/');
    } catch (err) {
      showError("重置密碼失敗，請稍後再試。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (tokenError) {
    return null; // 會重定向，無需顯示內容
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-orange-100">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-center text-orange-500">
            重置密碼
          </h2>
          <p className="text-center text-gray-500">
            請輸入您的新密碼
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Suspense fallback={<LoadingFallback />}>
            <FormInput
              id="newPassword"
              name="newPassword"
              label="新密碼"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />

            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              label="確認密碼"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
              showPassword={showConfirmPassword}
              togglePasswordVisibility={toggleConfirmPasswordVisibility}
            />

            <SubmitButton loading={loading} text="重置密碼" />
          </Suspense>
        </form>

        <div className="mt-6 flex flex-col items-center space-y-4">
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-600 hover:underline font-medium transition-colors"
          >
            返回登入
          </Link>
        </div>
      </div>
    </div>
  );
}

// 頁面组件使用Suspense包裝
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-orange-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-center text-orange-500">
              重置密碼
            </h2>
            <p className="text-center text-gray-500">
              正在載入...
            </p>
          </div>
          <div className="flex justify-center py-8">
            <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
} 