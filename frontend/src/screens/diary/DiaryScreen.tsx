import { useState, useEffect } from 'react'
import { recordsApi, type RecordRes } from '../../api/records'
import { albumsApi, type TrackSearchRes } from '../../api/albums'
import { useDebounce } from '../../hooks/useDebounce'
import AlbumCover from '../../components/AlbumCover'
import { SearchIcon, PlusIcon } from '../../components/Icon'
import { WeatherBadge } from '../../components/WeatherPicker'
import AddRecordModal from './AddRecordModal'
import CalendarView from './CalendarView'

type ViewTab = 'list' | 'calendar'

interface Props {
  onOpenDetail: (record: RecordRes) => void
}

export default function DiaryScreen({ onOpenDetail }: Props) {
  const [records, setRecords] = useState<RecordRes[]>([])
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<TrackSearchRes[]>([])
  const [searching, setSearching] = useState(false)
  const [addTrack, setAddTrack] = useState<TrackSearchRes | null>(null)
  const [viewTab, setViewTab] = useState<ViewTab>('list')
  const debouncedQuery = useDebounce(query, 400)

  // 기록 목록 로드
  const loadRecords = () => {
    recordsApi.list().then(setRecords).catch(console.error)
  }
  useEffect(loadRecords, [])

  // 트랙 검색
  useEffect(() => {
    if (!debouncedQuery.trim()) { setSearchResults([]); return }
    setSearching(true)
    albumsApi
      .searchTracks(debouncedQuery)
      .then(setSearchResults)
      .catch(console.error)
      .finally(() => setSearching(false))
  }, [debouncedQuery])

  const showSearch = query.trim().length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 헤더 */}
      <div style={{ padding: '8px 20px 16px' }}>
        <img src="/logo.png" alt="MJZ" style={{ height: 32, objectFit: 'contain', marginBottom: 4 }} />
        <div style={{ fontSize: 24, fontWeight: 700, color: '#17171A', letterSpacing: '-0.027em', textAlign: 'center' }}>
          일기
        </div>
      </div>

      {/* 검색바 */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#F4F4F5', borderRadius: 12, padding: '0 14px', height: 44,
        }}>
          <SearchIcon size={18} color="rgba(55,56,60,0.45)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="트랙, 아티스트 검색해서 기록 추가"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: '#17171A' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: 'rgba(55,56,60,0.4)', cursor: 'pointer', fontSize: 16 }}>✕</button>
          )}
        </div>
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
        {showSearch ? (
          // 검색 결과
          <div>
            {searching && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>검색 중...</div>
            )}
            {!searching && searchResults.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>
                검색 결과가 없어요
              </div>
            )}
            {searchResults.map((track) => (
              <TrackRow
                key={track.spotifyId}
                track={track}
                onAdd={() => setAddTrack(track)}
              />
            ))}
          </div>
        ) : records.length === 0 ? (
          // 빈 상태
          <EmptyState onSearch={() => document.querySelector<HTMLInputElement>('input[type="text"]')?.focus()} />
        ) : (
          <>
            {/* 리스트/캘린더 탭 */}
            <ViewTabBar tab={viewTab} setTab={setViewTab} />

            {viewTab === 'list' ? (
              // 기록 목록
              <div>
                {records.map((r) => (
                  <DiaryItem key={r.recordId} record={r} onTap={() => onOpenDetail(r)} />
                ))}
              </div>
            ) : (
              // 캘린더 뷰
              <CalendarView onOpenDetail={onOpenDetail} />
            )}
          </>
        )}
      </div>

      {/* 기록 추가 모달 */}
      {addTrack && (
        <AddRecordModal
          track={addTrack}
          onClose={() => setAddTrack(null)}
          onSaved={() => { setAddTrack(null); setQuery(''); loadRecords() }}
        />
      )}
    </div>
  )
}

function EmptyState({ onSearch }: { onSearch: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 32px', gap: 16 }}>
      <div style={{ fontSize: 36 }}>🎵</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: '#17171A', letterSpacing: '-0.01em' }}>오늘은 무얼 들었나요?</div>
        <div style={{ fontSize: 13, color: 'rgba(55,56,60,0.55)', marginTop: 6 }}>위 검색창에서 트랙을 찾아 기록을 남겨보세요</div>
      </div>
      <button
        onClick={onSearch}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '10px 18px', borderRadius: 12,
          background: '#17171A', color: '#fff', border: 'none',
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}
      >
        <PlusIcon size={16} color="#fff" />
        첫 기록 남기기
      </button>
    </div>
  )
}

function TrackRow({ track, onAdd }: { track: TrackSearchRes; onAdd: () => void }) {
  const mins = Math.floor(track.durationMs / 60000)
  const secs = Math.floor((track.durationMs % 60000) / 1000).toString().padStart(2, '0')
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px' }}>
      <AlbumCover artworkUrl={track.artworkUrl} albumName={track.albumName} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#17171A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {track.title}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.55)', marginTop: 2 }}>
          {track.artistName} · {mins}:{secs}
        </div>
      </div>
      <button
        onClick={onAdd}
        style={{
          width: 32, height: 32, borderRadius: 10, border: '1.5px solid rgba(112,115,124,0.22)',
          background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}
      >
        <PlusIcon size={16} />
      </button>
    </div>
  )
}

function ViewTabBar({ tab, setTab }: { tab: ViewTab; setTab: (t: ViewTab) => void }) {
  const tabs: { id: ViewTab; label: string }[] = [
    { id: 'list', label: '리스트' },
    { id: 'calendar', label: '캘린더' },
  ]
  return (
    <div style={{
      display: 'flex', margin: '0 16px 12px',
      background: '#F4F4F5', borderRadius: 10, padding: 3,
    }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          style={{
            flex: 1, padding: '7px 0', borderRadius: 8,
            border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
            background: tab === t.id ? '#fff' : 'transparent',
            color: tab === t.id ? '#17171A' : 'rgba(55,56,60,0.45)',
            boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const monthShort = d.toLocaleString('en', { month: 'short' }).toUpperCase()
  const day = d.getDate()
  return { badge: `${monthShort} ${day}`, full: dateStr.replace(/-/g, '. ') + '.' }
}

function DiaryItem({ record, onTap }: { record: RecordRes; onTap: () => void }) {
  const { badge, full } = formatDateLabel(record.recordedDate)

  return (
    <button
      onClick={onTap}
      style={{
        width: 'calc(100% - 32px)', margin: '0 16px 12px',
        padding: '16px', background: '#fff', border: '1px solid rgba(112,115,124,0.12)',
        borderRadius: 14, cursor: 'pointer', textAlign: 'left',
      }}
    >
      {/* 트랙 정보 */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <AlbumCover artworkUrl={record.artworkUrl} albumName={record.albumName} size={48} radius={10} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(55,56,60,0.45)', letterSpacing: '0.02em' }}>
            <span style={{ fontWeight: 700 }}>{badge}</span>
            <span style={{ margin: '0 4px' }}>·</span>
            <span>{full}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#17171A', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {record.trackTitle}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.55)', marginTop: 2 }}>
            {record.artistName} · {record.albumName}
          </div>
        </div>
      </div>

      {/* 날씨 뱃지 */}
      {record.weather && (
        <div style={{ marginTop: 10 }}>
          <WeatherBadge weather={record.weather} />
        </div>
      )}

      {/* 코멘트 */}
      {record.comment && (
        <div style={{
          marginTop: 12, padding: '10px 12px',
          background: '#F7F7F8', borderRadius: 10,
          fontSize: 13, color: '#37383C', lineHeight: 1.55, whiteSpace: 'pre-wrap',
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {record.comment}
        </div>
      )}
    </button>
  )
}
