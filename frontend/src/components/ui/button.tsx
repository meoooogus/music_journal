import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

type Variant = 'default' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  asChild?: boolean
}

const VARIANT_STYLES: Record<Variant, React.CSSProperties> = {
  default:   { background: '#17171A', color: '#fff', border: 'none' },
  secondary: { background: '#fff', color: '#17171A', border: '1.5px solid rgba(112,115,124,0.22)' },
  ghost:     { background: 'transparent', color: '#17171A', border: 'none' },
  danger:    { background: '#fff', color: '#FF4242', border: '1.5px solid rgba(255,66,66,0.3)' },
}

const SIZE_STYLES: Record<Size, React.CSSProperties> = {
  sm: { height: 36, padding: '0 14px', fontSize: 13, borderRadius: 10 },
  md: { height: 44, padding: '0 18px', fontSize: 14, borderRadius: 12 },
  lg: { height: 52, padding: '0 22px', fontSize: 15, borderRadius: 14 },
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          fontWeight: 600,
          fontFamily: 'inherit',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'opacity 0.15s',
          ...VARIANT_STYLES[variant],
          ...SIZE_STYLES[size],
          ...style,
        }}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button }
