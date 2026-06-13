import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(className)}
    style={{ position: 'relative', display: 'flex', width: '100%', alignItems: 'center', touchAction: 'none', userSelect: 'none' }}
    {...props}
  >
    <SliderPrimitive.Track style={{ position: 'relative', height: 8, width: '100%', flexGrow: 1, overflow: 'hidden', borderRadius: 999, background: 'linear-gradient(to right, #e74c3c, #e8c83a 50%, #2ecc71)' }}>
      <SliderPrimitive.Range style={{ position: 'absolute', height: '100%', background: 'transparent' }} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb style={{ display: 'block', width: 28, height: 20, borderRadius: 10, border: 'none', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', outline: 'none', cursor: 'pointer', flexShrink: 0 }} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
