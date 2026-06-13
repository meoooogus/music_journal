import { AvatarRoot, AvatarFallback } from './ui/avatar'

function hashHue(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) | 0
  return Math.abs(h) % 360
}

interface AvatarProps {
  username: string
  size?: number
}

export default function Avatar({ username, size = 28 }: AvatarProps) {
  const hue = hashHue(username || 'me')
  return (
    <AvatarRoot style={{ width: size, height: size }}>
      <AvatarFallback
        style={{ background: `linear-gradient(135deg, hsl(${hue},70%,75%), hsl(${(hue + 50) % 360},65%,55%))`, fontSize: size * 0.42 }}
      >
        {username?.[0]?.toUpperCase() ?? 'M'}
      </AvatarFallback>
    </AvatarRoot>
  )
}
