// 앨범 커버 — 실제 아트워크 URL 있으면 이미지, 없으면 그라데이션 + 이니셜

interface AlbumCoverProps {
  artworkUrl?: string | null
  albumName: string
  size?: number
  radius?: number
  // true일 경우 부모 width를 채우고 1:1 비율 유지
  fill?: boolean
}

function hashColor(s: string): [string, string] {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) | 0
  const hue = Math.abs(h) % 360
  return [`hsl(${hue},60%,80%)`, `hsl(${(hue + 40) % 360},55%,45%)`]
}

export default function AlbumCover({ artworkUrl, albumName, size = 56, radius = 8, fill = false }: AlbumCoverProps) {
  const sizeStyle = fill
    ? { width: '100%' as const, aspectRatio: '1', borderRadius: radius }
    : { width: size, height: size, borderRadius: radius, flexShrink: 0 as const }

  if (artworkUrl) {
    return (
      <img
        src={artworkUrl}
        alt={albumName}
        style={{ ...sizeStyle, objectFit: 'cover' as const, display: 'block' }}
      />
    )
  }

  const initial = albumName.replace(/[^A-Za-z가-힣]/g, '').slice(0, 2).toUpperCase() || '?'
  const [c1, c2] = hashColor(albumName)

  return (
    <div style={{
      ...sizeStyle,
      background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
      padding: (fill || size >= 48) ? 6 : 4, overflow: 'hidden',
    }}>
      <span style={{
        fontSize: fill ? 'clamp(12px, 4vw, 24px)' : size * 0.22, fontWeight: 700, color: 'rgba(0,0,0,0.45)',
        letterSpacing: '-0.04em', lineHeight: 1, textTransform: 'uppercase',
      }}>
        {initial}
      </span>
    </div>
  )
}
