import { useState, useEffect } from 'react'
import { recordsApi, type RecordRes } from '../../api/records'
import AlbumCover from '../../components/AlbumCover'

interface Props {
  onOpenDetail: (record: RecordRes) => void
}

// 해당 월의 1일 요일과 총 일수 계산
function getMonthInfo(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay() // 0=일 ~ 6=토
  const daysInMonth = new Date(year, month, 0).getDate()
  return { firstDay, daysInMonth }
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export default function CalendarView({ onOpenDetail }: Props) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [records, setRecords] = useState<RecordRes[]>([])

  useEffect(() => {
    recordsApi.listByMonth(year, month).then(setRecords).catch(console.error)
  }, [year, month])

  // date별 첫 번째 기록만 매핑
  const dateMap = new Map<number, RecordRes>()
  for (const r of records) {
    const day = parseInt(r.recordedDate.split('-')[2], 10)
    if (!dateMap.has(day)) dateMap.set(day, r)
  }

  const { firstDay, daysInMonth } = getMonthInfo(year, month)

  // 이전/다음 월 이동
  const goPrev = () => {
    if (month === 1) { setYear(year - 1); setMonth(12) }
    else setMonth(month - 1)
  }
  const goNext = () => {
    // 미래 월 방지
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1
    if (isCurrentMonth) return
    if (month === 12) { setYear(year + 1); setMonth(1) }
    else setMonth(month + 1)
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  // 캘린더 셀 배열 생성 (빈 칸 + 날짜)
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div style={{ padding: '0 16px' }}>
      {/* 월 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#17171A', letterSpacing: '-0.01em' }}>
          {year}년 {month}월
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <NavButton onClick={goPrev} label="<" />
          <NavButton onClick={goNext} label=">" disabled={isCurrentMonth} />
        </div>
      </div>

      {/* 요일 헤더 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {DAY_LABELS.map((d) => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 11, fontWeight: 600,
            color: 'rgba(55,56,60,0.45)', padding: '4px 0',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, i) => (
          <CalendarCell
            key={i}
            day={day}
            record={day ? dateMap.get(day) : undefined}
            onTap={onOpenDetail}
          />
        ))}
      </div>
    </div>
  )
}

function CalendarCell({ day, record, onTap }: {
  day: number | null
  record?: RecordRes
  onTap: (r: RecordRes) => void
}) {
  if (day === null) return <div />

  // 기록이 있는 날짜 — artwork 표시
  if (record) {
    return (
      <button
        onClick={() => onTap(record)}
        style={{
          aspectRatio: '1', width: '100%', padding: 0,
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <AlbumCover
          artworkUrl={record.artworkUrl}
          albumName={record.albumName}
          size={40}
          radius={10}
        />
      </button>
    )
  }

  // 기록 없는 날짜 — 숫자만
  return (
    <div style={{
      aspectRatio: '1', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, color: 'rgba(55,56,60,0.55)',
    }}>
      {day}
    </div>
  )
}

function NavButton({ onClick, label, disabled }: { onClick: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 32, height: 32, borderRadius: 8,
        border: '1px solid rgba(112,115,124,0.15)', background: '#fff',
        fontSize: 14, fontWeight: 600, cursor: disabled ? 'default' : 'pointer',
        color: disabled ? 'rgba(55,56,60,0.2)' : '#17171A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {label}
    </button>
  )
}
