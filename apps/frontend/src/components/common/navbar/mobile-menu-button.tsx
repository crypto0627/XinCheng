import { Menu, X } from 'lucide-react'

interface MobileMenuButtonProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function MobileMenuButton({ isOpen, setIsOpen }: MobileMenuButtonProps) {
  return (
    <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label='menu'>
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  )
} 