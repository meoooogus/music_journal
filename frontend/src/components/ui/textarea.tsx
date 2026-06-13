import * as React from 'react'
import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, style, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(className)}
    style={{
      width: '100%',
      borderRadius: 10,
      padding: '12px 14px',
      border: '1.5px solid rgba(112,115,124,0.22)',
      fontSize: 14,
      lineHeight: 1.6,
      resize: 'none',
      outline: 'none',
      color: '#17171A',
      background: '#F7F7F8',
      fontFamily: 'inherit',
      ...style,
    }}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Textarea }
