"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Home() {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // 如果用戶已登入，自動重定向到 dashboard
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  // 如果用戶已登入，不顯示任何內容，等待重定向
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <AuthForm onSuccess={() => router.push("/dashboard")} />
      </div>
    </div>
  );
}
