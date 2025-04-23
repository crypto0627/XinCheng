"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type AuthFormProps = {
  onSuccess?: () => void;
};

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToRegister = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 border border-orange-100">
      {isLogin ? (
        <LoginForm 
          onSuccess={onSuccess} 
          onSwitchToRegister={handleSwitchToRegister} 
        />
      ) : (
        <RegisterForm 
          onSuccess={onSuccess} 
          onSwitchToLogin={handleSwitchToLogin} 
        />
      )}
    </div>
  );
} 