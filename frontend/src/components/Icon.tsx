// SVG 아이콘 모음 — inline stroke 방식 (외부 파일 요청 없음)

interface IconProps {
  size?: number
  color?: string
}

export const SearchIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.8" />
    <path d="M20 20l-3.5-3.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const PlusIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const CloseIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export const PencilIcon = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 21l4-1 11-11-3-3L4 17l-1 4z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
)

export const DiaryIcon = ({ size = 22, color = 'currentColor', filled = false }: IconProps & { filled?: boolean }) =>
  filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M7 3h10a2 2 0 012 2v16l-7-3-7 3V5a2 2 0 012-2z" fill={color} />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 3h10a2 2 0 012 2v16l-7-3-7 3V5a2 2 0 012-2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )

export const ReviewIcon = ({ size = 22, color = 'currentColor', filled = false }: IconProps & { filled?: boolean }) =>
  filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill={color} />
      <path d="M16 8l-2 6-6 2 2-6z" fill="#fff" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <path d="M16 8l-2 6-6 2 2-6z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )

export const ProfileIcon = ({ size = 22, color = 'currentColor', filled = false }: IconProps & { filled?: boolean }) =>
  filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" fill={color} />
      <path d="M20 21a8 8 0 00-16 0" fill={color} />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M20 21a8 8 0 00-16 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )

export const FeedIcon = ({ size = 22, color = 'currentColor', filled = false }: IconProps & { filled?: boolean }) =>
  filled ? (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M3 12l9-8 9 8" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12v7a1 1 0 001 1h12a1 1 0 001-1v-7" fill={color} />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 12l9-8 9 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12v7a1 1 0 001 1h12a1 1 0 001-1v-7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

export const BackIcon = ({ size = 22, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 5l-7 7 7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const MoreIcon = ({ size = 22, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="5" cy="12" r="2" fill={color} />
    <circle cx="12" cy="12" r="2" fill={color} />
    <circle cx="19" cy="12" r="2" fill={color} />
  </svg>
)

export const ChevronRightIcon = ({ size = 16, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const TrashIcon = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 7h14M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M7 7l1 13a2 2 0 002 2h4a2 2 0 002-2l1-13" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const CalendarIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="1.6" />
    <path d="M3 10h18M8 3v4M16 3v4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export const CheckIcon = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12l5 5 9-11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const EyeIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.6" />
  </svg>
)

export const EyeOffIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M1 1l22 22" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)
