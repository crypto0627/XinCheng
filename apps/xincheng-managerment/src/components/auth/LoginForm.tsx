"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import * as authService from "@/services/auth.service";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import Swal from "sweetalert2";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const showError = (message: string) => {
    Swal.fire({
      icon: 'error',
      title: '登入錯誤',
      text: message,
      confirmButtonColor: '#f97316', // orange-500
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.error) {
        showError(response.error);
        setLoading(false);
        return;
      }

      if (response.user) {
        login(
          {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            role: response.user.role,
            isVerified: response.user.isVerified,
          },
          response.token
        );
        
        // Show success message
        await Swal.fire({
          position: 'center',
          icon: 'success',
          title: '登入成功！',
          text: `歡迎回來，${response.user.name}！`,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          background: '#fff',
          iconColor: '#f97316', // orange-500
        });
        
        // Navigate to dashboard after successful login
        router.push('/dashboard');
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      showError("身份驗證失敗。請稍後再試。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-center text-orange-500">
          登入
        </h2>
        <p className="text-center text-gray-500">
          歡迎回來！
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="email"
          name="email"
          label="電子郵件"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
          disabled={loading}
        />

        <FormInput
          id="password"
          name="password"
          label="密碼"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          disabled={loading}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
        />

        <div className="text-right">
          <a
            href="/forgot-password"
            className="text-sm text-orange-500 hover:text-orange-600 hover:underline transition-colors"
          >
            忘記密碼？
          </a>
        </div>

        <SubmitButton loading={loading} text="登入" />
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-orange-500 hover:text-orange-600 hover:underline font-medium transition-colors"
          disabled={loading}
          aria-label='register'
        >
          還沒有帳號？註冊
        </button>
      </div>
    </div>
  );
} 