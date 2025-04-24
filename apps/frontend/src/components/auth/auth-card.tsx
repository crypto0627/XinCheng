import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Image from 'next/image'

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
  footer?: {
    text: string
    onClick: () => void
    disabled?: boolean
  }
}

export function AuthCard({
  title,
  description,
  children,
  footer
}: AuthCardProps) {
  return (
    <Card className="shadow-lg w-full max-w-md mx-4">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.webp"
            alt="星橙 Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <CardTitle className="text-2xl font-bold text-center text-orange-600">
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            aria-label='footer-text'
            className="text-orange-600"
            onClick={footer.onClick}
            disabled={footer.disabled}
          >
            {footer.text}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
