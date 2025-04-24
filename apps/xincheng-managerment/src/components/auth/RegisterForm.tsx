"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import * as authService from "@/services/auth.service";
import FormInput from "./FormInput";
import RoleSelect from "./RoleSelect";
import SubmitButton from "./SubmitButton";
import { Role } from "@/hooks/useRoleSelect";
import Swal from "sweetalert2";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [role, setRole] = useState<Role>("user");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (selectedRole: Role) => {
    setRole(selectedRole);
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
      title: '註冊錯誤',
      text: message,
      confirmButtonColor: '#f97316', // orange-500
    });
  };

  const showSuccess = async (username: string) => {
    // 返回 Promise，確保等待用戶確認後再繼續
    return Swal.fire({
      title: '註冊成功！',
      text: `歡迎，${username}！您現在前往您的mail收取信件，並驗證完成後，才能登入。`,
      icon: 'success',
      confirmButtonText: '確認',
      confirmButtonColor: '#f97316', // orange-500
      timer: 3000,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 驗證密碼
      if (formData.password !== formData.confirmPassword) {
        showError("密碼不匹配");
        setLoading(false);
        return;
      }

      // 註冊用戶
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
      });

      if (response.error) {
        showError(response.error);
        setLoading(false);
        return;
      }

      // 檢查 API 回應內容
      console.log("註冊 API 回應:", response);

      // 即使沒有返回 user 對象，也繼續執行
      const userName = response.user?.name || formData.name;
      
      // 先存儲用戶資料
      if (response.user) {
        register(
          {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            role: response.user.role,
            isVerified: response.user.isVerified,
          },
          response.token
        );
      }
      
      // 顯示成功訊息，並等待用戶確認
      await showSuccess(userName);
      
      // 重置表單
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      
      // 只有在成功訊息確認後才跳轉到登入頁面
      onSwitchToLogin();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("註冊過程中發生錯誤:", err);
      showError("註冊失敗。請再試一次。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-center text-orange-500">
          註冊
        </h2>
        <p className="text-center text-gray-500">
          創建您的帳戶
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="name"
          name="name"
          label="姓名"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="您的姓名"
          required
          disabled={loading}
        />

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

        <RoleSelect
          initialRole="user"
          onChange={handleRoleChange}
          disabled={loading}
          required
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

        <SubmitButton loading={loading} text="創建帳戶" />
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-orange-500 hover:text-orange-600 hover:underline font-medium transition-colors"
          disabled={loading}
          aria-label='login'
        >
          已有帳戶？登入
        </button>
      </div>
    </div>
  );
} 