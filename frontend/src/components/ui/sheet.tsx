import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'
import { CloseIcon } from '@/components/Icon'

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close
const SheetPortal = DialogPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(className)}
    style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)' }}
    {...props}
  />
))
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName

// 바텀 시트
// footer prop: 항상 하단에 고정되는 액션 버튼 영역
const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    title?: string
    footer?: React.ReactNode
  }
>(({ className, children, title, footer, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(className)}
      style={{
        position: 'fixed',
        inset: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        zIndex: 101,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
      }}
      {...props}
    >
      {/* 헤더 — 고정 */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px 12px', flexShrink: 0 }}>
        {title && (
          <DialogPrimitive.Title style={{ flex: 1, fontSize: 16, fontWeight: 700, color: '#17171A', margin: 0 }}>
            {title}
          </DialogPrimitive.Title>
        )}
        <SheetClose style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(55,56,60,0.5)', display: 'flex', alignItems: 'center' }}>
          <CloseIcon size={20} />
        </SheetClose>
      </div>

      {/* 스크롤 가능한 콘텐츠 */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {children}
      </div>

      {/* 하단 버튼 — 항상 노출 */}
      {footer && (
        <div style={{ padding: '12px 20px 24px', borderTop: '1px solid rgba(112,115,124,0.12)', flexShrink: 0, background: '#fff' }}>
          {footer}
        </div>
      )}
    </DialogPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = 'SheetContent'

export { Sheet, SheetTrigger, SheetClose, SheetContent }
