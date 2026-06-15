// shadcn Button 래퍼 — 기존 variant 인터페이스 유지
import { Button as ShadButton } from './ui/button'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: Variant
  size?: Size
  full?: boolean
  disabled?: boolean
  icon?: ReactNode
  style?: React.CSSProperties
  type?: 'button' | 'submit' | 'reset'
}

const VARIANT_MAP = {
  primary:   'default',
  secondary: 'secondary',
  ghost:     'ghost',
  danger:    'danger',
} as const

const SIZE_MAP = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const

export default function Button({ children, onClick, variant = 'primary', size = 'md', full, disabled, icon, style, type = 'button' }: ButtonProps) {
  return (
    <ShadButton
      type={type}
      variant={VARIANT_MAP[variant]}
      size={SIZE_MAP[size]}
      disabled={disabled}
      onClick={onClick}
      style={{ ...(full ? { width: '100%' } : {}), ...style }}
    >
      {icon}{children}
    </ShadButton>
  )
}
