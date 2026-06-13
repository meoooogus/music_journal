import * as React from 'react'

type Variant = 'default' | 'dark' | 'danger' | 'outline'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

const VARIANT_STYLES: Record<Variant, React.CSSProperties> = {
  dark:    { background: '#17171A', color: '#fff' },
  default: { background: '#F4F4F5', color: '#17171A' },
  danger:  { background: '#FFF5F5', color: '#FF4242' },
  outline: { background: '#F4F4F5', color: '#37383C' },
}

function Badge({ className, variant = 'default', style, ...props }: BadgeProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        padding: '3px 8px',
        width: 44,
        fontSize: 12,
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
        ...VARIANT_STYLES[variant],
        ...style,
      }}
      {...props}
    />
  )
}

export { Badge }
