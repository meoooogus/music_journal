import { useState, useEffect, type FormEvent } from 'react'
import { profileApi, type ProfileMyRes, type ProfileRes } from '../../api/profile'
import { followApi } from '../../api/follow'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../../components/Avatar'
import AlbumCover from '../../components/AlbumCover'
import RatingChip from '../../components/RatingChip'
import Button from '../../components/Button'
import { BackIcon } from '../../components/Icon'
import type { AlbumSearchRes } from '../../api/albums'
import type { FollowUserRes } from '../../api/follow'

interface Props {
  onOpenAlbum?: (album: AlbumSearchRes) => void
  onOpenProfile?: (username: string) => void
  onBack?: () => void
  // 다른 유저 프로필을 볼 경우 username 전달, 없으면 내 프로필
  viewingUsername?: string
}

export default function ProfileScreen({ onOpenAlbum, onOpenProfile, onBack, viewingUsername }: Props) {
  const { logout, username: myUsername } = useAuth()
  const [myProfile, setMyProfile] = useState<ProfileMyRes | null>(null)
  const [otherProfile, setOtherProfile] = useState<ProfileRes | null>(null)
  const [tab, setTab] = useState<'reviews' | 'stats'>('reviews')
  const [loading, setLoading] = useState(true)
  // 팔로우 상태 — 인스타그램 스타일 optimistic UI
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [localFollowerCount, setLocalFollowerCount] = useState(0)
  // 팔로워/팔로잉 목록 모달
  const [followListType, setFollowListType] = useState<'followers' | 'followings' | null>(null)
  // 프로필 편집 페이지
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (viewingUsername) {
      profileApi.get(viewingUsername).then((p) => {
        setOtherProfile(p)
        setLocalFollowerCount(p.followerCount)
      }).catch(console.error).finally(() => setLoading(false))

      // 내가 이 유저를 팔로우하고 있는지 확인
      if (myUsername) {
        followApi.followings(myUsername).then((list) => {
          setIsFollowing(list.some((u) => u.username === viewingUsername))
        }).catch(console.error)
      }
    } else {
      profileApi.me().then((p) => {
        setMyProfile(p)
        setLocalFollowerCount(p.followerCount)
      }).catch(console.error).finally(() => setLoading(false))
    }
  }, [viewingUsername, myUsername])

  const profile = viewingUsername ? otherProfile : myProfile
  const stat = myProfile?.stat ?? null

  // 팔로우/언팔로우 토글 — optimistic update
  const toggleFollow = async () => {
    if (!viewingUsername || followLoading) return
    setFollowLoading(true)
    const wasFollowing = isFollowing
    // 즉시 UI 반영
    setIsFollowing(!wasFollowing)
    setLocalFollowerCount((c) => c + (wasFollowing ? -1 : 1))
    try {
      if (wasFollowing) {
        await followApi.unfollow(viewingUsername)
      } else {
        await followApi.follow(viewingUsername)
      }
    } catch {
      // 실패 시 롤백
      setIsFollowing(wasFollowing)
      setLocalFollowerCount((c) => c + (wasFollowing ? 1 : -1))
    } finally {
      setFollowLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>불러오는 중...</div>
  }
  if (!profile) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>프로필을 불러올 수 없어요</div>
  }

  const toAlbum = (r: { spotifyAlbumId: string; albumName: string; artistName: string; artworkUrl: string | null }): AlbumSearchRes => ({
    spotifyId: r.spotifyAlbumId, title: r.albumName, artistName: r.artistName,
    artistId: '', artworkUrl: r.artworkUrl, releaseDate: '', totalTracks: 0,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* 상단 바 — @username */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid rgba(112,115,124,0.1)' }}>
        {viewingUsername && onBack ? (
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, background: 'transparent', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BackIcon size={20} />
          </button>
        ) : (
          <div style={{ width: 12 }} />
        )}
        <div style={{ flex: 1, fontSize: 16, fontWeight: 700, color: '#17171A' }}>@{profile.username}</div>
      </div>

      {/* 프로필 헤더 */}
      <div style={{ padding: '16px 20px 16px', borderBottom: '1px solid rgba(112,115,124,0.1)' }}>
        {/* 아바타 + 평론/팔로워/팔로잉 수 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Avatar username={profile.username} size={64} />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#17171A' }}>{profile.reviewCount}</div>
              <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.55)', marginTop: 2 }}>평론</div>
            </div>
            <button onClick={() => setFollowListType('followers')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#17171A' }}>{localFollowerCount}</div>
              <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.55)', marginTop: 2 }}>팔로워</div>
            </button>
            <button onClick={() => setFollowListType('followings')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#17171A' }}>{profile.followingCount}</div>
              <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.55)', marginTop: 2 }}>팔로잉</div>
            </button>
          </div>
        </div>

        {/* 닉네임 */}
        {profile.nickname && (
          <div style={{ marginTop: 12, fontSize: 15, fontWeight: 700, color: '#17171A' }}>{profile.nickname}</div>
        )}

        {/* 버튼 */}
        <div style={{ marginTop: 12 }}>
          {!viewingUsername ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" size="sm" full onClick={() => setEditOpen(true)}>프로필 편집</Button>
              <Button variant="secondary" size="sm" full onClick={logout}>로그아웃</Button>
            </div>
          ) : (
            <Button
              variant={isFollowing ? 'secondary' : 'primary'}
              size="sm"
              full
              disabled={followLoading}
              onClick={toggleFollow}
            >
              {isFollowing ? '팔로잉' : '팔로우'}
            </Button>
          )}
        </div>
      </div>

      {/* 탭 (내 프로필만 통계 탭 보임) */}
      {!viewingUsername && (
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(112,115,124,0.1)' }}>
          {(['reviews', 'stats'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, height: 44, background: 'none', border: 'none',
                fontSize: 13, fontWeight: 600,
                color: tab === t ? '#17171A' : 'rgba(55,56,60,0.45)',
                borderBottom: tab === t ? '2px solid #17171A' : '2px solid transparent',
                cursor: 'pointer', transition: 'color 0.15s',
              }}
            >
              {t === 'reviews' ? '평론' : '통계'}
            </button>
          ))}
        </div>
      )}

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
        {(viewingUsername || tab === 'reviews') && (
          <ReviewList reviews={profile.reviews} onOpenAlbum={onOpenAlbum} toAlbum={toAlbum} />
        )}

        {!viewingUsername && tab === 'stats' && stat && (
          <StatsView stat={stat} onOpenAlbum={onOpenAlbum} toAlbum={toAlbum} />
        )}
      </div>

      {/* 팔로워/팔로잉 목록 모달 */}
      {followListType && (
        <FollowListModal
          username={profile.username}
          type={followListType}
          onClose={() => setFollowListType(null)}
          onOpenProfile={(u) => { setFollowListType(null); onOpenProfile?.(u) }}
        />
      )}

      {/* 프로필 편집 페이지 */}
      {editOpen && myProfile && (
        <ProfileEditPage
          currentUsername={myProfile.username}
          currentNickname={myProfile.nickname ?? ''}
          onClose={() => setEditOpen(false)}
          onSaved={() => {
            setEditOpen(false)
            // 프로필 새로고침
            profileApi.me().then((p) => {
              setMyProfile(p)
              setLocalFollowerCount(p.followerCount)
            }).catch(console.error)
          }}
        />
      )}
    </div>
  )
}

function ReviewList({
  reviews,
  onOpenAlbum,
  toAlbum,
}: {
  reviews: ProfileMyRes['reviews']
  onOpenAlbum?: (a: AlbumSearchRes) => void
  toAlbum: (r: { spotifyAlbumId: string; albumName: string; artistName: string; artworkUrl: string | null }) => AlbumSearchRes
}) {
  if (reviews.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>
        아직 평론이 없어요
      </div>
    )
  }
  return (
    <div>
      {reviews.map((r) => (
        <button
          key={r.spotifyAlbumId}
          onClick={() => onOpenAlbum?.(toAlbum(r))}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid rgba(112,115,124,0.1)' }}
        >
          <AlbumCover artworkUrl={r.artworkUrl} albumName={r.albumName} size={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#17171A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.albumName}</div>
            <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.55)', marginTop: 1 }}>{r.artistName}</div>
            {r.content && (
              <div style={{ fontSize: 12, color: '#37383C', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.content}</div>
            )}
          </div>
          <RatingChip value={r.rating} />
        </button>
      ))}
    </div>
  )
}

function StatsView({
  stat,
  onOpenAlbum,
  toAlbum,
}: {
  stat: NonNullable<ProfileMyRes['stat']>
  onOpenAlbum?: (a: AlbumSearchRes) => void
  toAlbum: (r: { spotifyAlbumId: string; albumName: string; artistName: string; artworkUrl: string | null }) => AlbumSearchRes
}) {
  return (
    <div style={{ padding: '20px' }}>
      {/* 요약 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <StatCard label="전체 기록" value={stat.totalCount} unit="곡" />
        <StatCard label="이번 달" value={stat.monthlyCount} unit="곡" />
      </div>

      {/* Top 아티스트 */}
      <Section title="Top 아티스트">
        {stat.topArtists.length > 0 ? stat.topArtists.map((a, i) => (
          <div key={a.artistId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(112,115,124,0.08)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(55,56,60,0.3)', width: 16, textAlign: 'center' }}>{i + 1}</span>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#17171A' }}>{a.artistName}</div>
            <span style={{ fontSize: 12, color: 'rgba(55,56,60,0.45)' }}>{a.count}곡</span>
          </div>
        )) : <EmptyHint text="기록을 남기면 자주 듣는 아티스트가 여기에 표시돼요" />}
      </Section>

      {/* Top 앨범 */}
      <Section title="Top 앨범">
        {stat.topAlbums.length > 0 ? stat.topAlbums.map((a, i) => (
          <div key={a.albumId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(112,115,124,0.08)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(55,56,60,0.3)', width: 16, textAlign: 'center' }}>{i + 1}</span>
            <AlbumCover artworkUrl={a.artworkUrl} albumName={a.albumName} size={36} radius={6} />
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#17171A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.albumName}</div>
            <span style={{ fontSize: 12, color: 'rgba(55,56,60,0.45)' }}>{a.count}곡</span>
          </div>
        )) : <EmptyHint text="기록을 남기면 자주 듣는 앨범이 여기에 표시돼요" />}
      </Section>

      {/* 평점 높은 평론 */}
      <Section title="내 베스트 평론">
        {stat.topRatedReviews.length > 0 ? stat.topRatedReviews.map((r) => (
          <button
            key={r.spotifyAlbumId}
            onClick={() => onOpenAlbum?.(toAlbum(r))}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid rgba(112,115,124,0.08)' }}
          >
            <AlbumCover artworkUrl={r.artworkUrl} albumName={r.albumName} size={36} radius={6} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#17171A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.albumName}</div>
              <div style={{ fontSize: 11, color: 'rgba(55,56,60,0.5)' }}>{r.artistName}</div>
            </div>
            <RatingChip value={r.rating} />
          </button>
        )) : <EmptyHint text="평론을 남기면 높은 평점 순으로 여기에 표시돼요" />}
      </Section>
    </div>
  )
}

function StatCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div style={{ padding: '16px', background: '#F7F7F8', borderRadius: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(55,56,60,0.5)', letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: '#17171A', letterSpacing: '-0.03em' }}>{value}</span>
        <span style={{ fontSize: 12, color: 'rgba(55,56,60,0.5)' }}>{unit}</span>
      </div>
    </div>
  )
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div style={{ padding: '16px 0', fontSize: 13, color: 'rgba(55,56,60,0.4)', textAlign: 'center' }}>
      {text}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(55,56,60,0.5)', letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  )
}

/* ── 팔로워/팔로잉 목록 모달 ── */

function FollowListModal({ username, type, onClose, onOpenProfile }: {
  username: string
  type: 'followers' | 'followings'
  onClose: () => void
  onOpenProfile: (username: string) => void
}) {
  const { username: myUsername } = useAuth()
  const [list, setList] = useState<FollowUserRes[]>([])
  const [loading, setLoading] = useState(true)
  // 내가 팔로우 중인 유저 Set — 각 행의 팔로우 버튼 상태용
  const [myFollowingSet, setMyFollowingSet] = useState<Set<string>>(new Set())

  useEffect(() => {
    setLoading(true)
    const fetchList = type === 'followers' ? followApi.followers : followApi.followings
    fetchList(username).then(setList).catch(console.error).finally(() => setLoading(false))

    // 내 팔로잉 목록 조회 — 버튼 상태 결정
    if (myUsername) {
      followApi.followings(myUsername).then((res) => {
        setMyFollowingSet(new Set(res.map((u) => u.username)))
      }).catch(console.error)
    }
  }, [username, type, myUsername])

  // 팔로우/언팔로우 토글 — optimistic + 중복 클릭 방지
  const [pendingFollows, setPendingFollows] = useState<Set<string>>(new Set())
  const toggleFollow = async (target: string) => {
    if (pendingFollows.has(target)) return
    setPendingFollows((prev) => new Set(prev).add(target))

    const wasFollowing = myFollowingSet.has(target)
    setMyFollowingSet((prev) => {
      const next = new Set(prev)
      wasFollowing ? next.delete(target) : next.add(target)
      return next
    })
    try {
      if (wasFollowing) {
        await followApi.unfollow(target)
      } else {
        await followApi.follow(target)
      }
    } catch {
      // 롤백
      setMyFollowingSet((prev) => {
        const next = new Set(prev)
        wasFollowing ? next.add(target) : next.delete(target)
        return next
      })
    } finally {
      setPendingFollows((prev) => { const next = new Set(prev); next.delete(target); return next })
    }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid rgba(112,115,124,0.1)' }}>
        <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: 12, background: 'transparent', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BackIcon size={20} />
        </button>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 700, color: '#17171A' }}>
          {type === 'followers' ? '팔로워' : '팔로잉'}
        </div>
      </div>

      {/* 목록 */}
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
        {loading && (
          <div style={{ padding: 20, textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>불러오는 중...</div>
        )}
        {!loading && list.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(55,56,60,0.45)', fontSize: 13 }}>
            {type === 'followers' ? '아직 팔로워가 없어요' : '아직 팔로잉이 없어요'}
          </div>
        )}
        {list.map((u) => {
          const isMe = u.username === myUsername
          const isFollowing = myFollowingSet.has(u.username)
          return (
            <div
              key={u.username}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 20px',
                borderBottom: '1px solid rgba(112,115,124,0.08)',
              }}
            >
              {/* 프로필 진입 영역 */}
              <button
                onClick={() => onOpenProfile(u.username)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                <Avatar username={u.username} size={36} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#17171A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.nickname ?? u.username}</div>
                  <div style={{ fontSize: 12, color: 'rgba(55,56,60,0.55)' }}>@{u.username}</div>
                </div>
              </button>
              {/* 팔로우 버튼 — 본인 제외 */}
              {!isMe && (
                <Button
                  variant={isFollowing ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => toggleFollow(u.username)}
                >
                  {isFollowing ? '팔로잉' : '팔로우'}
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── 프로필 편집 페이지 ── */

function ProfileEditPage({ currentUsername, currentNickname, onClose, onSaved }: {
  currentUsername: string
  currentNickname: string
  onClose: () => void
  onSaved: () => void
}) {
  const [username, setUsername] = useState(currentUsername)
  const [nickname, setNickname] = useState(currentNickname)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const usernameOk = /^[a-z0-9_]{3,20}$/.test(username)
  const nicknameOk = nickname.trim().length >= 1
  const hasChanges = username !== currentUsername || nickname !== currentNickname
  const canSave = usernameOk && nicknameOk && hasChanges

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSave || loading) return
    setLoading(true)
    setError('')
    try {
      await profileApi.update({ username, nickname })
      onSaved()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(typeof msg === 'string' ? msg : '저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid rgba(112,115,124,0.1)' }}>
        <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: 12, background: 'transparent', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BackIcon size={20} />
        </button>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 700, color: '#17171A' }}>프로필 편집</div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSave} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
          {/* 아이디 */}
          <div>
            <label style={editLabelStyle}>아이디</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'rgba(55,56,60,0.4)' }}>@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                style={{ ...editInputStyle, paddingLeft: 30 }}
              />
            </div>
            {username && !usernameOk && (
              <div style={{ fontSize: 12, color: '#FF4242', marginTop: 4 }}>영문 소문자, 숫자, _ 조합 3–20자</div>
            )}
          </div>

          {/* 닉네임 */}
          <div>
            <label style={editLabelStyle}>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="표시될 이름"
              style={editInputStyle}
            />
          </div>

          {error && (
            <div style={{ fontSize: 13, color: '#FF4242' }}>{error}</div>
          )}
        </div>

        {/* 저장 버튼 — 하단 고정 */}
        <div style={{ paddingTop: 16 }}>
          <Button full disabled={!canSave || loading} type="submit">
            {loading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </form>
    </div>
  )
}

const editLabelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#37383C', marginBottom: 6,
}

const editInputStyle: React.CSSProperties = {
  width: '100%', height: 48, padding: '0 14px',
  borderRadius: 8, fontSize: 15, fontWeight: 500,
  border: '1.5px solid rgba(112,115,124,0.22)',
  outline: 'none', background: '#fff', color: '#17171A',
}
