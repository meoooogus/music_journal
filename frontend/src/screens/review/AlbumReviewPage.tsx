import { useState, useEffect, useRef } from 'react'
import { reviewsApi, type ReviewRes } from '../../api/reviews'
import { albumsApi, type AlbumSearchRes, type AlbumDetailRes, type AlbumTrackRes } from '../../api/albums'
import { useAuth } from '../../context/AuthContext'
import AlbumCover from '../../components/AlbumCover'
import Avatar from '../../components/Avatar'
import RatingChip from '../../components/RatingChip'
import Button from '../../components/Button'
import { BackIcon, PlusIcon, PencilIcon, TrashIcon } from '../../components/Icon'
import WriteReviewModal from './WriteReviewModal'

interface Props {
  album: AlbumSearchRes
  onBack: () => void
  onOpenAlbum: (album: AlbumSearchRes) => void
  onOpenProfile: (username: string) => void
  showToast: (msg: string) => void
}

export default function AlbumReviewPage({ album, onBack, onOpenAlbum, onOpenProfile, showToast }: Props) {
  const { username } = useAuth()
  const [detail, setDetail] = useState<AlbumDetailRes | null>(null)
  const [loading, setLoading] = useState(true)
  const [writeOpen, setWriteOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const loadDetail = () => {
    setLoading(true)
    albumsApi
      .getDetail(album.spotifyId)
      .then(setDetail)
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(loadDetail, [album.spotifyId])

  // 내 리뷰를 첫 번째로 정렬
  const sortedReviews = detail?.reviews
    ? [
        ...detail.reviews.filter((r) => r.username === username),
        ...detail.reviews.filter((r) => r.username !== username),
      ]
    : []

  const myReview = sortedReviews.find((r) => r.username === username) ?? null

  const handleDelete = async () => {
    await reviewsApi.delete(album.spotifyId)
    setDeleteOpen(false)
    loadDetail()
    showToast('평론을 삭제했어요')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, position: 'relative' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid rgba(112,115,124,0.1)' }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, background: 'transparent', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BackIcon size={20} />
        </button>
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
        {/* 앨범 커버 히어로 */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 20px 16px' }}>
          <AlbumCover artworkUrl={album.artworkUrl} albumName={album.title} size={200} radius={16} />
        </div>

        {/* 앨범 정보 */}
        <div style={{ textAlign: 'center', padding: '0 20px 20px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#17171A', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            {album.title}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(55,56,60,0.5)', marginTop: 4 }}>
            Album · {album.artistName}
          </div>
          {/* 평균 평점 */}
          {detail?.avgRating != null && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#2ecc71' }}>
                {detail.avgRating.toFixed(1)}
              </span>
              <span style={{ fontSize: 13, color: 'rgba(55,56,60,0.45)' }}>
                ({detail.reviewCount} reviews)
              </span>
            </div>
          )}
        </div>

        {/* 리뷰 카드 — 가로 슬라이딩 */}
        {!loading && sortedReviews.length > 0 && (
          <ReviewCarousel
            reviews={sortedReviews}
            username={username}
            onEdit={() => setWriteOpen(true)}
            onDelete={() => setDeleteOpen(true)}
            onOpenAlbum={onOpenAlbum}
            onOpenProfile={onOpenProfile}
          />
        )}
        {!loading && sortedReviews.length === 0 && (
          <div style={{ padding: '24px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#17171A' }}>첫 평론을 남겨보세요</div>
            <div style={{ fontSize: 13, color: 'rgba(55,56,60,0.45)', marginTop: 6 }}>이 앨범에 대한 당신의 생각이 궁금해요</div>
          </div>
        )}

        {/* Overview 섹션 */}
        <SectionCard title="Overview" style={{ margin: '12px 16px' }}>
          {album.releaseDate && (
            <div style={{ fontSize: 14, color: '#37383C' }}>
              <span style={{ fontWeight: 600 }}>Released:</span> {album.releaseDate}
            </div>
          )}
          {detail?.spotifyUrl && (
            <a
              href={detail.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 14, fontWeight: 600, color: '#17171A', textDecoration: 'none' }}
            >
              Play on Spotify
              <SpotifyIcon />
            </a>
          )}
        </SectionCard>

        {/* 트랙 목록 */}
        {detail?.tracks && detail.tracks.length > 0 && (
          <SectionCard title="Songs" style={{ margin: '12px 16px' }}>
            {detail.tracks.map((track) => (
              <TrackRow key={`${track.discNumber}-${track.trackNumber}`} track={track} artworkUrl={album.artworkUrl} albumName={album.title} />
            ))}
          </SectionCard>
        )}

        <div style={{ height: 80 }} />
      </div>

      {/* FAB — 내 리뷰 없으면 작성 버튼 */}
      {!myReview && (
        <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
          <button
            onClick={async () => {
              try { await albumsApi.upsert(album.spotifyId, album) } catch { /* noop */ }
              setWriteOpen(true)
            }}
            style={{
              width: 52, height: 52, borderRadius: 16,
              background: '#17171A', color: '#fff', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <PlusIcon size={22} color="#fff" />
          </button>
        </div>
      )}

      {writeOpen && (
        <WriteReviewModal
          album={album}
          existingReview={myReview}
          onClose={() => setWriteOpen(false)}
          onSaved={() => { setWriteOpen(false); loadDetail(); showToast('평론을 저장했어요') }}
        />
      )}

      {deleteOpen && (
        <DeleteReviewDialog
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

/* ── 리뷰 카드 가로 슬라이딩 ── */

function ReviewCarousel({ reviews, username, onEdit, onDelete, onOpenAlbum, onOpenProfile }: {
  reviews: ReviewRes[]
  username: string | null
  onEdit: () => void
  onDelete: () => void
  onOpenAlbum: (album: AlbumSearchRes) => void
  onOpenProfile: (username: string) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollRef}
      className="hide-scrollbar"
      style={{
        display: 'flex', gap: 10, padding: '0 16px 8px',
        overflowX: 'auto', scrollSnapType: 'x mandatory',
      }}
    >
      {reviews.map((r) => (
        <ReviewSlideCard
          key={r.reviewId}
          review={r}
          isMine={r.username === username}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpenAlbum={onOpenAlbum}
          onOpenProfile={onOpenProfile}
        />
      ))}
    </div>
  )
}

function ReviewSlideCard({ review, isMine, onEdit, onDelete, onOpenAlbum, onOpenProfile }: {
  review: ReviewRes
  isMine: boolean
  onEdit: () => void
  onDelete: () => void
  onOpenAlbum: (album: AlbumSearchRes) => void
  onOpenProfile: (username: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // 텍스트가 실제로 잘렸는지 감지
  useEffect(() => {
    const el = contentRef.current
    if (el) setClamped(el.scrollHeight > el.clientHeight)
  }, [review.content])

  return (
    <div style={{
      minWidth: 220, maxWidth: 260, flex: '0 0 auto',
      background: '#F4F4F5', borderRadius: 14, padding: '14px 16px',
      scrollSnapAlign: 'start',
    }}>
      {/* 유저 + 평점 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <button
          onClick={() => onOpenProfile(review.username)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: 1, minWidth: 0 }}
        >
          <Avatar username={review.username} size={28} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#17171A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{review.username}</span>
        </button>
        <RatingChip value={review.rating} size="sm" />
      </div>

      {/* 리뷰 본문 */}
      {review.content && (
        <>
          <div
            ref={contentRef}
            style={{
              fontSize: 13, color: '#37383C', lineHeight: 1.55, whiteSpace: 'pre-wrap',
              ...(!expanded && { display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }),
            }}
          >
            {review.content}
          </div>
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

      {/* 추천 앨범 */}
      {review.recommendations.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(55,56,60,0.4)', marginBottom: 4 }}>함께 들어볼 앨범</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {review.recommendations.map((rec) => (
            <button
              key={rec.spotifyAlbumId}
              onClick={() => onOpenAlbum({
                spotifyId: rec.spotifyAlbumId, title: rec.albumName,
                artistName: rec.artistName, artistId: '', artworkUrl: rec.artworkUrl,
                releaseDate: '', totalTracks: 0,
              })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', background: '#E8E8EA', borderRadius: 999, fontSize: 10, fontWeight: 500, color: '#37383C', border: 'none', cursor: 'pointer' }}
            >
              {rec.albumName}
            </button>
          ))}
          </div>
        </div>
      )}

      {/* 내 리뷰 수정/삭제 */}
      {isMine && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: 10 }}>
          <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(55,56,60,0.5)', padding: 4, display: 'flex' }}>
            <PencilIcon size={14} />
          </button>
          <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF4242', padding: 4, display: 'flex' }}>
            <TrashIcon size={14} color="#FF4242" />
          </button>
        </div>
      )}
    </div>
  )
}

/* ── 섹션 카드 (Overview, Songs) ── */

function SectionCard({ title, children, style }: { title: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#F4F4F5', borderRadius: 14, padding: '16px 18px', ...style }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#17171A', marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  )
}

/* ── 트랙 행 ── */

function TrackRow({ track, artworkUrl, albumName }: { track: AlbumTrackRes; artworkUrl: string | null; albumName: string }) {
  // 밀리초 → m:ss 변환
  const min = Math.floor(track.durationMs / 60000)
  const sec = Math.floor((track.durationMs % 60000) / 1000)
  const duration = `${min}:${sec.toString().padStart(2, '0')}`

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0',
      borderTop: '1px solid rgba(112,115,124,0.08)',
    }}>
      <AlbumCover artworkUrl={artworkUrl} albumName={albumName} size={40} radius={6} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#17171A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {track.title}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {track.artistName}
        </div>
      </div>
      <span style={{ fontSize: 12, color: 'rgba(55,56,60,0.4)', flexShrink: 0 }}>{duration}</span>
    </div>
  )
}

/* ── Spotify 아이콘 ── */

function SpotifyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

/* ── 삭제 확인 다이얼로그 ── */

function DeleteReviewDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [loading, setLoading] = useState(false)
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100 }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 101, background: '#fff', borderRadius: 16, padding: '24px 20px',
        width: 'calc(100% - 48px)', maxWidth: 320,
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#17171A', marginBottom: 8 }}>평론을 삭제할까요?</div>
        <div style={{ fontSize: 14, color: 'rgba(55,56,60,0.6)', marginBottom: 24 }}>삭제한 평론은 복구할 수 없어요.</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" full onClick={onClose}>취소</Button>
          <Button variant="danger" full disabled={loading} onClick={async () => { setLoading(true); await onConfirm(); setLoading(false) }}>
            {loading ? '삭제 중...' : '삭제하기'}
          </Button>
        </div>
      </div>
    </>
  )
}
