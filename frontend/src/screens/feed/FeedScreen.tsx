import { useState, useEffect, useCallback, useRef } from 'react'
import { feedApi, type FeedItem } from '../../api/feed'
import AlbumCover from '../../components/AlbumCover'
import RatingChip from '../../components/RatingChip'
import type { AlbumSearchRes } from '../../api/albums'

type FeedTab = 'following' | 'explore'

export type { FeedTab }

interface Props {
  onOpenAlbum: (album: AlbumSearchRes) => void
  onOpenProfile: (username: string) => void
  feedTab: FeedTab
  setFeedTab: (t: FeedTab) => void
}

function FeedCard({ item, timeAgo, onOpenAlbum, onOpenProfile, toAlbumSearch }: {
  item: FeedItem
  timeAgo: (iso: string) => string
  onOpenAlbum: (album: AlbumSearchRes) => void
  onOpenProfile: (username: string) => void
  toAlbumSearch: (item: FeedItem) => AlbumSearchRes
}) {
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)
  const contentRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (el) setClamped(el.scrollHeight > el.clientHeight)
  }, [item.content])

  return (
    <div style={{ background: '#F4F4F5', borderRadius: 16, padding: 16, marginBottom: 12 }}>
      {/* 상단: 유저 정보 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <button
          onClick={() => onOpenProfile(item.username)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(55,56,60,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff',
          }}>
            {(item.nickname || item.username).charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#17171A' }}>
            @{item.username}
          </span>
        </button>
        <span style={{ fontSize: 11, color: 'rgba(55,56,60,0.4)', marginLeft: 6 }}>
          {timeAgo(item.createdAt)}
        </span>
      </div>

      {/* 가운데: 앨범 정보 */}
      <button
        onClick={() => onOpenAlbum(toAlbumSearch(item))}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', padding: 0,
        }}
      >
        <AlbumCover artworkUrl={item.artworkUrl} albumName={item.albumName} size={72} radius={8} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#17171A', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.albumName}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.55)', marginTop: 2 }}>
            {item.artistName}
          </div>
        </div>
        <RatingChip value={item.rating} size="md" />
      </button>

      {/* 코멘트 */}
      {item.content && (
        <>
          <p
            ref={contentRef}
            style={{
              fontSize: 13, color: '#37383C', lineHeight: 1.5, margin: '10px 0 0',
              wordBreak: 'break-word', whiteSpace: 'pre-wrap',
              ...(!expanded && { display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }),
            }}
          >
            {item.content}
          </p>
          {clamped && (
            <button
              onClick={() => setExpanded((v) => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 4, fontSize: 12, fontWeight: 600, color: 'rgba(55,56,60,0.45)' }}
            >
              {expanded ? '접기' : '더보기'}
            </button>
          )}
        </>
      )}

      {/* 추천앨범 */}
      {item.recommendations.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(55,56,60,0.45)', letterSpacing: '0.02em' }}>
            함께 들어볼 앨범
          </span>
          <div style={{ display: 'flex', gap: 8, marginTop: 6, overflowX: 'auto' }}>
            {item.recommendations.map((rec) => (
              <button
                key={rec.spotifyAlbumId}
                onClick={() => onOpenAlbum({
                  spotifyId: rec.spotifyAlbumId, title: rec.albumName,
                  artistName: rec.artistName, artistId: '', artworkUrl: rec.artworkUrl,
                  releaseDate: '', totalTracks: 0,
                })}
                style={{
                  background: 'rgba(255,255,255,0.7)', border: 'none',
                  borderRadius: 10, padding: 6, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                }}
              >
                <AlbumCover artworkUrl={rec.artworkUrl} albumName={rec.albumName} size={32} radius={6} />
                <div style={{ maxWidth: 100 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#17171A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {rec.albumName}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(55,56,60,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {rec.artistName}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default function FeedScreen({ onOpenAlbum, onOpenProfile, feedTab, setFeedTab }: Props) {
  const [items, setItems] = useState<FeedItem[]>([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 탭 변경 시 초기화
  useEffect(() => {
    setItems([])
    setPage(0)
    setHasMore(true)
    setError(false)
    setLoading(true)
  }, [feedTab])

  // 데이터 로드
  useEffect(() => {
    if (!loading) return
    const fetch = feedTab === 'following' ? feedApi.following : feedApi.latest
    fetch(page, 10)
      .then((res) => {
        const content = res.content ?? []
        setItems((prev) => page === 0 ? content : [...prev, ...content])
        setHasMore(!res.last)
        setLoading(false)
      })
      .catch(() => { setError(true); setLoading(false) })
  }, [feedTab, page, loading])

  // 무한 스크롤
  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || loading || !hasMore) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
      setPage((p) => p + 1)
      setLoading(true)
    }
  }, [loading, hasMore])

  // 피드 아이템 → 앨범 상세용 변환
  const toAlbumSearch = (item: FeedItem): AlbumSearchRes => ({
    spotifyId: item.spotifyAlbumId,
    title: item.albumName,
    artistName: item.artistName,
    artistId: '',
    artworkUrl: item.artworkUrl,
    releaseDate: '',
    totalTracks: 0,
  })

  // 시간 포맷 (방금, N분 전, N시간 전, N일 전)
  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const min = Math.floor(diff / 60000)
    if (min < 1) return '방금'
    if (min < 60) return `${min}분 전`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr}시간 전`
    const day = Math.floor(hr / 24)
    return `${day}일 전`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 헤더 + 세그먼트 탭 */}
      <div style={{ padding: '8px 20px 12px' }}>
        <img src="/logo.png" alt="MJZ" style={{ height: 32, objectFit: 'contain', marginBottom: 8 }} />
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          {(['following', 'explore'] as FeedTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setFeedTab(t)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em',
                color: feedTab === t ? '#17171A' : 'rgba(55,56,60,0.35)',
                padding: '4px 0',
              }}
            >
              {t === 'following' ? 'Following' : 'Explore'}
            </button>
          ))}
        </div>
      </div>

      {/* 피드 리스트 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="hide-scrollbar"
        style={{ flex: 1, overflowY: 'auto', padding: '0 12px 20px' }}
      >
        {items.map((item) => (
          <FeedCard
            key={item.reviewId}
            item={item}
            timeAgo={timeAgo}
            onOpenAlbum={onOpenAlbum}
            onOpenProfile={onOpenProfile}
            toAlbumSearch={toAlbumSearch}
          />
        ))}

        {/* 로딩 / 빈 상태 */}
        {loading && (
          <div style={{ padding: 20, textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>
            불러오는 중...
          </div>
        )}
        {!loading && error && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>
            피드를 불러올 수 없어요
          </div>
        )}
        {!loading && !error && items.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>
            {feedTab === 'following' ? '팔로잉한 유저의 리뷰가 없어요' : '아직 리뷰가 없어요'}
          </div>
        )}
      </div>
    </div>
  )
}
