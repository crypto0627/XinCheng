import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Key, Mail } from 'lucide-react'

interface SocialAuthButtonsProps {
  isLogin: boolean
  isLoading: boolean
  onGoogleLogin: () => Promise<void>
}

export function SocialAuthButtons({
  isLogin,
  isLoading,
  onGoogleLogin,
}: SocialAuthButtonsProps) {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">或</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onGoogleLogin}
          disabled={isLoading}
          aria-label='google-login'
        >
          <Mail className="mr-2 h-5 w-5" />
          使用 Google 帳號{isLogin ? '登入' : '註冊'}
        </Button>
      </div>
    </div>
  )
}
