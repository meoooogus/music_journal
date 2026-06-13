import { useRef, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { recordsApi, type TrackReq } from '../../api/records'
import { albumsApi, type TrackSearchRes } from '../../api/albums'
import AlbumCover from '../../components/AlbumCover'
import Button from '../../components/Button'
import { CalendarIcon, SearchIcon, PlusIcon } from '../../components/Icon'
import { Sheet, SheetContent } from '../../components/ui/sheet'
import { Textarea } from '../../components/ui/textarea'
import WeatherPicker, { type WeatherKey } from '../../components/WeatherPicker'
import { useDebounce } from '../../hooks/useDebounce'

// 날짜를 한국어 형식으로 포맷
function formatKoreanDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`
}

interface Props {
  track?: TrackSearchRes | null
  onClose: () => void
  onSaved: () => void
}

export default function AddRecordModal({ track: initialTrack, onClose, onSaved }: Props) {
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const dateRef = useRef<HTMLInputElement>(null)
  const [comment, setComment] = useState('')
  const [weather, setWeather] = useState<WeatherKey | null>(null)
  const [loading, setLoading] = useState(false)

  // 트랙 선택 상태
  const [selectedTrack, setSelectedTrack] = useState<TrackSearchRes | null>(initialTrack ?? null)
  const [trackQuery, setTrackQuery] = useState('')
  const [trackResults, setTrackResults] = useState<TrackSearchRes[]>([])
  const [trackSearching, setTrackSearching] = useState(false)
  const debouncedTrackQuery = useDebounce(trackQuery, 400)

  // 트랙 검색
  useEffect(() => {
    if (!debouncedTrackQuery.trim()) { setTrackResults([]); return }
    setTrackSearching(true)
    albumsApi
      .searchTracks(debouncedTrackQuery)
      .then(setTrackResults)
      .catch(console.error)
      .finally(() => setTrackSearching(false))
  }, [debouncedTrackQuery])

  const handleSave = async () => {
    if (loading || !selectedTrack) return
    setLoading(true)
    const trackReq: TrackReq = {
      spotifyId: selectedTrack.spotifyId,
      title: selectedTrack.title,
      artistName: selectedTrack.artistName,
      artistId: selectedTrack.artistId,
      albumName: selectedTrack.albumName,
      albumId: selectedTrack.albumId,
      artworkUrl: selectedTrack.artworkUrl,
      durationMs: selectedTrack.durationMs,
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
          <Button full onClick={handleSave} disabled={!selectedTrack || loading}>
            {loading ? '저장 중...' : '기록하기'}
          </Button>
        }
      >
        {/* 트랙 선택 영역 */}
        <div style={{ padding: '0 20px 16px' }}>
          <label style={labelStyle}>트랙</label>
          {selectedTrack ? (
            // 선택된 트랙 표시
            <div style={{
              display: 'flex', gap: 12, alignItems: 'center',
              padding: '10px 12px', background: '#F7F7F8', borderRadius: 12,
            }}>
              <AlbumCover artworkUrl={selectedTrack.artworkUrl} albumName={selectedTrack.albumName} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#17171A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedTrack.title}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.55)', marginTop: 2 }}>
                  {selectedTrack.artistName}
                </div>
              </div>
              <button
                onClick={() => { setSelectedTrack(null); setTrackQuery(''); setTrackResults([]) }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, color: 'rgba(55,56,60,0.5)',
                  padding: '4px 8px', flexShrink: 0,
                }}
              >
                변경
              </button>
            </div>
          ) : (
            // 트랙 검색
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#F4F4F5', borderRadius: 10, padding: '0 12px', height: 40,
              }}>
                <SearchIcon size={15} color="rgba(55,56,60,0.4)" />
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="트랙 또는 아티스트 검색"
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: '#17171A' }}
                />
                {trackQuery && (
                  <button onClick={() => setTrackQuery('')} style={{ background: 'none', border: 'none', color: 'rgba(55,56,60,0.4)', cursor: 'pointer', fontSize: 14 }}>✕</button>
                )}
              </div>
              {/* 검색 결과 */}
              {trackSearching && (
                <div style={{ padding: '12px 0', textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>검색 중...</div>
              )}
              {!trackSearching && trackQuery.trim() && trackResults.length === 0 && (
                <div style={{ padding: '12px 0', textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>결과 없음</div>
              )}
              {trackResults.length > 0 && (
                <div style={{ maxHeight: 180, overflowY: 'auto', marginTop: 8 }}>
                  {trackResults.map((t) => (
                    <button
                      key={t.spotifyId}
                      onClick={() => { setSelectedTrack(t); setTrackQuery(''); setTrackResults([]) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '8px 4px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <AlbumCover artworkUrl={t.artworkUrl} albumName={t.albumName} size={36} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#17171A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {t.title}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(55,56,60,0.55)' }}>{t.artistName}</div>
                      </div>
                      <PlusIcon size={14} color="rgba(55,56,60,0.4)" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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
