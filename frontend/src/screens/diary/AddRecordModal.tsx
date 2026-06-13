import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { recordsApi, type TrackReq } from '../../api/records'
import type { TrackSearchRes } from '../../api/albums'
import AlbumCover from '../../components/AlbumCover'
import Button from '../../components/Button'
import { CalendarIcon } from '../../components/Icon'
import { Sheet, SheetContent } from '../../components/ui/sheet'
import { Textarea } from '../../components/ui/textarea'
import WeatherPicker, { type WeatherKey } from '../../components/WeatherPicker'

// 날짜를 한국어 형식으로 포맷
function formatKoreanDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`
}

interface Props {
  track: TrackSearchRes
  onClose: () => void
  onSaved: () => void
}

export default function AddRecordModal({ track, onClose, onSaved }: Props) {
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const dateRef = useRef<HTMLInputElement>(null)
  const [comment, setComment] = useState('')
  const [weather, setWeather] = useState<WeatherKey | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (loading) return
    setLoading(true)
    const trackReq: TrackReq = {
      spotifyId: track.spotifyId,
      title: track.title,
      artistName: track.artistName,
      artistId: track.artistId,
      albumName: track.albumName,
      albumId: track.albumId,
      artworkUrl: track.artworkUrl,
      durationMs: track.durationMs,
    }
    try {
      await recordsApi.create({
        track: trackReq,
        recordedDate: date,
        comment: comment || undefined,
        weather: weather ?? undefined,
      })
      onSaved()
    } catch {
      toast.error('저장에 실패했어요')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent
        title="일기 추가"
        footer={
          <Button full onClick={handleSave} disabled={loading}>
            {loading ? '저장 중...' : '기록하기'}
          </Button>
        }
      >
        {/* 트랙 카드 */}
        <div style={{ display: 'flex', gap: 12, padding: '4px 20px 16px', background: '#F7F7F8', borderRadius: 12, margin: '0 20px 20px' }}>
          <AlbumCover artworkUrl={track.artworkUrl} albumName={track.albumName} size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#17171A' }}>{track.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.55)', marginTop: 2 }}>{track.artistName}</div>
            <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.45)', marginTop: 1 }}>{track.albumName}</div>
          </div>
        </div>

        {/* 날짜 — 스타일된 버튼 + hidden native date picker */}
        <div style={{ padding: '0 20px 16px' }}>
          <label style={labelStyle}>날짜</label>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => dateRef.current?.showPicker()}
              style={{
                width: '100%', height: 48, padding: '0 14px',
                borderRadius: 10,
                border: '1.5px solid rgba(112,115,124,0.22)',
                background: '#F7F7F8',
                color: '#17171A',
                fontSize: 15, fontWeight: 500,
                textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              {formatKoreanDate(date)}
              <CalendarIcon size={18} color="rgba(55,56,60,0.45)" />
            </button>
            <input
              ref={dateRef}
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0, overflow: 'hidden' }}
            />
          </div>
        </div>

        {/* 날씨 */}
        <div style={{ padding: '0 20px 16px' }}>
          <label style={labelStyle}>
            날씨 <span style={{ color: 'rgba(55,56,60,0.4)', fontWeight: 400 }}>(선택)</span>
          </label>
          <WeatherPicker selected={weather} onSelect={setWeather} />
        </div>

        {/* 코멘트 */}
        <div style={{ padding: '0 20px 16px' }}>
          <label style={labelStyle}>
            코멘트 <span style={{ color: 'rgba(55,56,60,0.4)', fontWeight: 400 }}>(선택)</span>
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="이 트랙에 대한 짧은 감상을 남겨보세요"
            rows={3}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#37383C', marginBottom: 6,
}

// ── 공용 ModalSheet — 이전 코드와의 호환성 유지 ──────────────────
export function ModalSheet({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent title={title}>
        {children}
      </SheetContent>
    </Sheet>
  )
}
