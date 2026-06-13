import { useState, useEffect } from 'react'
import { albumsApi, type AlbumSearchRes, type TrendingRes } from '../../api/albums'
import { useDebounce } from '../../hooks/useDebounce'
import AlbumCover from '../../components/AlbumCover'
import RatingChip from '../../components/RatingChip'
import { SearchIcon } from '../../components/Icon'

interface Props {
  onOpenAlbum: (album: AlbumSearchRes) => void
}

export default function ReviewScreen({ onOpenAlbum }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AlbumSearchRes[]>([])
  const [trending, setTrending] = useState<TrendingRes | null>(null)
  const [searching, setSearching] = useState(false)
  const debouncedQuery = useDebounce(query, 400)

  // 이번 달 화제의 앨범 로드
  useEffect(() => {
    albumsApi.trending().then(setTrending).catch(console.error)
  }, [])

  // 앨범 검색
  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); return }
    setSearching(true)
    albumsApi
      .searchAlbums(debouncedQuery)
      .then(setResults)
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
          앨범 탐색
        </div>
      </div>

      {/* 검색바 */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F4F4F5', borderRadius: 12, padding: '0 14px', height: 44 }}>
          <SearchIcon size={18} color="rgba(55,56,60,0.45)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="앨범, 아티스트 검색"
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
          <div style={{ padding: '0 16px' }}>
            {searching && <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>검색 중...</div>}
            {!searching && results.length === 0 && <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>검색 결과가 없어요</div>}
            {results.map((a) => (
              <AlbumRow key={a.spotifyId} album={a} onTap={() => onOpenAlbum(a)} />
            ))}
          </div>
        ) : (
          // 이번 달 화제의 앨범
          <TrendingSection trending={trending} onOpenAlbum={onOpenAlbum} />
        )}
      </div>
    </div>
  )
}

function TrendingSection({ trending, onOpenAlbum }: { trending: TrendingRes | null; onOpenAlbum: (a: AlbumSearchRes) => void }) {
  if (!trending) return <div style={{ padding: 20, textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>불러오는 중...</div>

  const convert = (a: { spotifyAlbumId: string; albumName: string; artistName: string; artworkUrl: string | null }): AlbumSearchRes => ({
    spotifyId: a.spotifyAlbumId,
    title: a.albumName,
    artistName: a.artistName,
    artistId: '',
    artworkUrl: a.artworkUrl,
    releaseDate: '',
    totalTracks: 0,
  })

  return (
    <div style={{ padding: '0 0 20px' }}>
      {/* 가장 많이 평론된 앨범 — 히어로 */}
      {trending.mostReviewed.length > 0 && (
        <div style={{ padding: '0 16px 20px' }}>
          <SectionTitle>이번 달 화제의 앨범</SectionTitle>
          {/* 1위 히어로 */}
          <button
            onClick={() => onOpenAlbum(convert(trending.mostReviewed[0]!))}
            style={{ width: '100%', borderRadius: 16, overflow: 'hidden', background: 'none', border: 'none', cursor: 'pointer', display: 'block', marginBottom: 10 }}
          >
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
              <AlbumCover artworkUrl={trending.mostReviewed[0]!.artworkUrl} albumName={trending.mostReviewed[0]!.albumName} fill radius={16} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{trending.mostReviewed[0]!.albumName}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{trending.mostReviewed[0]!.artistName}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>평론 {trending.mostReviewed[0]!.reviewCount}개</div>
              </div>
            </div>
          </button>

          {/* 나머지 그리드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {trending.mostReviewed.slice(1).map((a) => (
              <button key={a.spotifyAlbumId} onClick={() => onOpenAlbum(convert(a))} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 12, overflow: 'hidden' }}>
                <AlbumCover artworkUrl={a.artworkUrl} albumName={a.albumName} fill radius={12} />
                <div style={{ padding: '6px 2px 0' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#17171A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.albumName}</div>
                  <div style={{ fontSize: 11, color: 'rgba(55,56,60,0.55)' }}>{a.artistName}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 평점 높은 앨범 */}
      {trending.highestRated.length > 0 && (
        <div style={{ padding: '0 16px' }}>
          <SectionTitle>평점 높은 앨범</SectionTitle>
          {trending.highestRated.map((a) => (
            <AlbumRow
              key={a.spotifyAlbumId}
              album={convert(a)}
              rating={a.avgRating}
              onTap={() => onOpenAlbum(convert(a))}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 700, color: '#17171A', letterSpacing: '-0.01em', marginBottom: 12, paddingTop: 4 }}>
      {children}
    </div>
  )
}

function AlbumRow({ album, rating, onTap }: { album: AlbumSearchRes; rating?: number; onTap: () => void }) {
  return (
    <button onClick={onTap} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid rgba(112,115,124,0.1)' }}>
      <AlbumCover artworkUrl={album.artworkUrl} albumName={album.title} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#17171A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{album.title}</div>
        <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.55)', marginTop: 1 }}>{album.artistName}{album.releaseDate ? ` · ${album.releaseDate}` : ''}</div>
      </div>
      {rating !== undefined && <RatingChip value={rating} />}
    </button>
  )
}
