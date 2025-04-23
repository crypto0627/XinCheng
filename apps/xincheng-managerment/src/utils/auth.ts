// 允許訪問的電子郵件列表
export const ALLOWED_EMAILS = ["Puff91337@gmail.com", "jake0627a1@gmail.com"];

/**
 * 檢查用戶是否有權限訪問管理界面
 * @param email 用戶電子郵件
 * @returns 是否有權限
 */
export const hasAdminAccess = (email: string): boolean => {
  return ALLOWED_EMAILS.includes(email);
};

/**
 * 檢查用戶並重定向未授權用戶
 * @param user 用戶對象
 * @param router Next.js router 對象
 * @returns 是否重定向（true = 已重定向，false = 沒有重定向）
 */
export const checkAuthAndRedirect = (
  user: { email: string } | null | undefined,
  router: { push: (path: string) => void }
): boolean => {
  if (!user) {
    router.push("/");
    return true;
  }

  if (!hasAdminAccess(user.email)) {
    router.push("/unauthorized");
    return true;
  }

  return false;
}; 