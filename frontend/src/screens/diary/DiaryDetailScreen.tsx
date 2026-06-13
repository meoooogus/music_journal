import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { recordsApi, type RecordRes, type RecordUpdateReq } from '../../api/records'
import AlbumCover from '../../components/AlbumCover'
import Button from '../../components/Button'
import { BackIcon, CalendarIcon, PencilIcon, TrashIcon } from '../../components/Icon'
import { Sheet, SheetContent } from '../../components/ui/sheet'
import { Textarea } from '../../components/ui/textarea'
import WeatherPicker, { WEATHER_MAP, type WeatherKey } from '../../components/WeatherPicker'

function formatKoreanDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`
}

interface Props {
  record: RecordRes
  onBack: () => void
  onDeleted: () => void
  onUpdated: (updated: RecordRes) => void
  showToast: (msg: string) => void
}

export default function DiaryDetailScreen({ record, onBack, onDeleted, onUpdated, showToast }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 내비 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid rgba(112,115,124,0.1)' }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, background: 'transparent', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#17171A' }}>
          <BackIcon size={20} />
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setEditOpen(true)}
          style={{ width: 40, height: 40, borderRadius: 12, background: 'transparent', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#17171A' }}
        >
          <PencilIcon size={18} />
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          style={{ width: 40, height: 40, borderRadius: 12, background: 'transparent', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF4242' }}
        >
          <TrashIcon size={18} color="#FF4242" />
        </button>
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '28px 24px 40px' }}>
        {/* 트랙명 = 일기 제목 */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#17171A', lineHeight: 1.35, letterSpacing: '-0.02em' }}>
              {record.trackTitle}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(55,56,60,0.5)', marginTop: 4 }}>
              {record.artistName}
            </div>
          </div>
          <AlbumCover artworkUrl={record.artworkUrl} albumName={record.albumName} size={48} radius={8} />
        </div>

        {/* 날짜 + 날씨 — 일기장 메타 */}
        <div style={{ fontSize: 13, color: 'rgba(55,56,60,0.45)', marginTop: 20 }}>
          {formatKoreanDate(record.recordedDate)}
          {record.weather && WEATHER_MAP[record.weather as WeatherKey] && (
            <> · {WEATHER_MAP[record.weather as WeatherKey].emoji} {WEATHER_MAP[record.weather as WeatherKey].label}</>
          )}
        </div>

        {/* 구분선 */}
        <div style={{ height: 1, background: 'rgba(112,115,124,0.08)', margin: '20px 0' }} />

        {/* 코멘트 본문 */}
        <div style={{ fontSize: 15, color: '#2C2C2E', lineHeight: 1.8, letterSpacing: '-0.01em', whiteSpace: 'pre-wrap' }}>
          {record.comment || <span style={{ color: 'rgba(55,56,60,0.3)', fontStyle: 'italic' }}>아직 감상을 남기지 않았어요</span>}
        </div>
      </div>

      {/* 수정 모달 */}
      {editOpen && (
        <EditDiaryModal
          record={record}
          onClose={() => setEditOpen(false)}
          onSaved={(updated) => { setEditOpen(false); onUpdated(updated); showToast('일기를 수정했어요 · Saved') }}
        />
      )}

      {/* 삭제 확인 다이얼로그 */}
      {deleteOpen && (
        <DeleteDiaryDialog
          onClose={() => setDeleteOpen(false)}
          onConfirm={async () => {
            await recordsApi.delete(record.recordId)
            setDeleteOpen(false)
            onDeleted()
            showToast('일기를 삭제했어요 · Removed')
          }}
        />
      )}
    </div>
  )
}

// ── 수정 모달 ──────────────────────────────────────────
function EditDiaryModal({ record, onClose, onSaved }: { record: RecordRes; onClose: () => void; onSaved: (r: RecordRes) => void }) {
  const [date, setDate] = useState(record.recordedDate)
  const [comment, setComment] = useState(record.comment ?? '')
  const [weather, setWeather] = useState<WeatherKey | null>((record.weather as WeatherKey) ?? null)
  const [loading, setLoading] = useState(false)
  const dateRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    if (loading) return
    setLoading(true)
    const body: RecordUpdateReq = {
      recordedDate: date,
      comment: comment || undefined,
      weather: weather ?? undefined,
    }
    try {
      const updated = await recordsApi.update(record.recordId, body)
      onSaved(updated)
    } catch {
      toast.error('수정에 실패했어요')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent
        title="일기 수정"
        footer={
          <Button full onClick={handleSave} disabled={loading}>
            {loading ? '저장 중...' : '저장하기'}
          </Button>
        }
      >
        {/* 트랙 (잠김) */}
        <div style={{ display: 'flex', gap: 10, padding: '12px 20px', background: '#F7F7F8', borderRadius: 10, margin: '0 20px 20px', alignItems: 'center' }}>
          <AlbumCover artworkUrl={record.artworkUrl} albumName={record.albumName} size={40} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#17171A' }}>{record.trackTitle}</div>
            <div style={{ fontSize: 11, color: 'rgba(55,56,60,0.5)' }}>{record.artistName} · 트랙은 변경할 수 없어요</div>
          </div>
        </div>

        <div style={{ padding: '0 20px 16px' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#37383C', marginBottom: 6 }}>날짜</label>
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
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0, overflow: 'hidden' }}
            />
          </div>
        </div>

        {/* 날씨 */}
        <div style={{ padding: '0 20px 16px' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#37383C', marginBottom: 6 }}>
            날씨 <span style={{ color: 'rgba(55,56,60,0.4)', fontWeight: 400 }}>(선택)</span>
          </label>
          <WeatherPicker selected={weather} onSelect={setWeather} />
        </div>

        <div style={{ padding: '0 20px 16px' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#37383C', marginBottom: 6 }}>코멘트</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ── 삭제 확인 ─────────────────────────────────────────
function DeleteDiaryDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [loading, setLoading] = useState(false)
  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent
        title="일기 삭제"
        footer={
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" full onClick={onClose}>취소</Button>
            <Button variant="danger" full onClick={async () => { setLoading(true); await onConfirm(); setLoading(false) }} disabled={loading}>
              {loading ? '삭제 중...' : '삭제하기'}
            </Button>
          </div>
        }
      >
        <div style={{ padding: '8px 20px 24px', fontSize: 14, color: 'rgba(55,56,60,0.6)' }}>
          삭제한 기록은 복구할 수 없어요.
        </div>
      </SheetContent>
    </Sheet>
  )
}
