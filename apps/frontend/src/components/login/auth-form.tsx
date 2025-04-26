import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface AuthFormProps {
  isLogin: boolean
  isLoading: boolean
  onSubmit: (
    email: string,
    password: string,
    confirmPassword?: string,
    username?: string,
    phone?: string
  ) => Promise<void>
}

export function AuthForm({ isLogin, isLoading, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      await onSubmit(email, password)
    } else {
      await onSubmit(email, password, confirmPassword, username, phone)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  if (isLogin) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">電子郵件</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">密碼</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={togglePasswordVisibility}
              aria-label='show-password'
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          aria-label='loading'
          className="w-full bg-orange-600 hover:bg-orange-700"
          disabled={isLoading}
        >
          {isLoading ? '處理中...' : '登入'}
        </Button>
      </form>
    )
  } else {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">用戶名</Label>
          <Input
            id="username"
            type="text"
            placeholder="您的用戶名"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">電子郵件</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">電話</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="您的電話號碼"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">密碼</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              aria-label='show-password'
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">確認密碼</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              aria-label='show-confirm-password'
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          aria-label='loading'
          className="w-full bg-orange-600 hover:bg-orange-700"
          disabled={isLoading}
        >
          {isLoading ? '處理中...' : '註冊'}
        </Button>
      </form>
    )
  }
}
