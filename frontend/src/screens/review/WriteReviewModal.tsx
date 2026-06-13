import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { reviewsApi, type RecommendationReq, type ReviewRes } from '../../api/reviews'
import { albumsApi, type AlbumSearchRes } from '../../api/albums'
import { useDebounce } from '../../hooks/useDebounce'
import AlbumCover from '../../components/AlbumCover'
import Button from '../../components/Button'
import { Sheet, SheetContent } from '../../components/ui/sheet'
import { Slider } from '../../components/ui/slider'
import { Textarea } from '../../components/ui/textarea'
import { CloseIcon, SearchIcon } from '../../components/Icon'

interface Props {
  album: AlbumSearchRes
  existingReview?: ReviewRes | null
  onClose: () => void
  onSaved: () => void
}

export default function WriteReviewModal({ album, existingReview, onClose, onSaved }: Props) {
  const [rating, setRating] = useState(existingReview?.rating ?? 7.0)
  const [content, setContent] = useState(existingReview?.content ?? '')
  const [recs, setRecs] = useState<RecommendationReq[]>([])
  const [recQuery, setRecQuery] = useState('')
  const [recResults, setRecResults] = useState<AlbumSearchRes[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedRecQuery = useDebounce(recQuery, 400)

  // 추천 앨범 검색
  useEffect(() => {
    if (!debouncedRecQuery.trim()) { setRecResults([]); return }
    albumsApi.searchAlbums(debouncedRecQuery).then(setRecResults).catch(console.error)
  }, [debouncedRecQuery])

  const addRec = (a: AlbumSearchRes) => {
    if (recs.length >= 3 || recs.some((r) => r.spotifyAlbumId === a.spotifyId)) return
    setRecs((prev) => [...prev, {
      spotifyAlbumId: a.spotifyId,
      albumName: a.title,
      artistName: a.artistName,
      artistId: a.artistId,
      artworkUrl: a.artworkUrl,
      releaseDate: a.releaseDate,
      totalTracks: a.totalTracks,
    }])
    setRecQuery('')
    setRecResults([])
  }
  const removeRec = (id: string) => setRecs((prev) => prev.filter((r) => r.spotifyAlbumId !== id))

  const handleSave = async () => {
    if (loading) return
    setLoading(true)
    try {
      await reviewsApi.upsert(album.spotifyId, { rating, content: content || undefined, recommendations: recs })
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
        title={existingReview ? '평론 수정' : '평론 작성'}
        footer={
          <Button full onClick={handleSave} disabled={loading}>
            {loading ? '저장 중...' : '평론 저장'}
          </Button>
        }
      >
        {/* 앨범 */}
        <div style={{ display: 'flex', gap: 10, padding: '8px 20px 16px', alignItems: 'center' }}>
          <AlbumCover artworkUrl={album.artworkUrl} albumName={album.title} size={44} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#17171A' }}>{album.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.55)' }}>{album.artistName}</div>
          </div>
        </div>

        {/* 평점 — gradient slider */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(112,115,124,0.1)' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#37383C', marginBottom: 12 }}>평점</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <Slider
                min={0.1} max={10} step={0.1}
                value={[rating]}
                onValueChange={([v]) => setRating(v!)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 11, color: 'rgba(55,56,60,0.45)' }}>awful</span>
                <span style={{ fontSize: 11, color: 'rgba(55,56,60,0.45)' }}>mid</span>
                <span style={{ fontSize: 11, color: 'rgba(55,56,60,0.45)' }}>amazing</span>
              </div>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#17171A', letterSpacing: '-0.02em', minWidth: 40, textAlign: 'right' }}>
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* 평론 텍스트 — shadcn Textarea */}
        <div style={{ padding: '0 20px 16px' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#37383C', marginBottom: 6 }}>
            평론 <span style={{ fontWeight: 400, color: 'rgba(55,56,60,0.4)' }}>(선택)</span>
          </label>
          <Textarea
            value={content ?? ''}
            onChange={(e) => setContent(e.target.value)}
            placeholder="이 앨범에 대한 생각을 자유롭게 써보세요"
            rows={4}
          />
        </div>

        {/* 추천 앨범 */}
        <div style={{ padding: '0 20px 20px' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#37383C', marginBottom: 6 }}>
            함께 들으면 좋은 앨범 <span style={{ fontWeight: 400, color: 'rgba(55,56,60,0.4)' }}>(최대 3개)</span>
          </label>

          {recs.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {recs.map((r) => (
                <span key={r.spotifyAlbumId} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: '#17171A', color: '#fff', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
                  {r.albumName}
                  <button onClick={() => removeRec(r.spotifyAlbumId)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                    <CloseIcon size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {recs.length < 3 && (
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F4F4F5', borderRadius: 10, padding: '0 12px', height: 40 }}>
                <SearchIcon size={15} color="rgba(55,56,60,0.4)" />
                <input
                  type="text"
                  value={recQuery}
                  onChange={(e) => setRecQuery(e.target.value)}
                  placeholder="앨범 검색"
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#17171A' }}
                />
              </div>
              {recResults.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden', marginTop: 4 }}>
                  {recResults.slice(0, 4).map((a) => (
                    <button key={a.spotifyId} onClick={() => addRec(a)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                      <AlbumCover artworkUrl={a.artworkUrl} albumName={a.title} size={32} radius={6} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#17171A' }}>{a.title}</div>
                        <div style={{ fontSize: 11, color: 'rgba(55,56,60,0.5)' }}>{a.artistName}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </SheetContent>
    </Sheet>
  )
}
