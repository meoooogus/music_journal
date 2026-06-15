import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, success, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full h-12 px-3.5 rounded-lg text-[15px] font-medium outline-none transition-colors',
          'border-[1.5px] bg-white text-[#17171A] placeholder:text-[rgba(55,56,60,0.35)]',
          error   ? 'border-[#FF4242]' :
          success ? 'border-[#00BF40]' :
                    'border-[rgba(112,115,124,0.22)] focus:border-[#17171A]',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
