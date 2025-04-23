"use client";

import { useState } from "react";
import * as authService from "@/services/auth.service";
import FormInput from "@/components/auth/FormInput";
import SubmitButton from "@/components/auth/SubmitButton";
import Swal from "sweetalert2";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
    setLoading(true);

    try {
      // 調用忘記密碼 API
      await authService.forgotPassword({ email });

      // 即使用戶不存在，API 也會返回成功（安全措施）
      await Swal.fire({
        icon: 'success',
        title: '請檢查您的郵箱',
        text: '如果您的電子郵件已註冊，您將收到重置密碼的鏈接。',
        confirmButtonColor: '#f97316', // orange-500
      });

      // 重置輸入
      setEmail("");
      
    } catch (err) {
      showError("發生錯誤，請稍後再試。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-orange-100">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-center text-orange-500">
            忘記密碼
          </h2>
          <p className="text-center text-gray-500">
            輸入您的電子郵件，我們將發送重置密碼的鏈接
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="email"
            name="email"
            label="電子郵件"
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            disabled={loading}
          />

          <SubmitButton loading={loading} text="發送重置鏈接" />
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