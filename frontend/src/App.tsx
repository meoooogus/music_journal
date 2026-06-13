import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { useAuth } from './context/AuthContext'
import TabBar from './components/TabBar'
import LoginScreen from './screens/auth/LoginScreen'
import RegisterScreen from './screens/auth/RegisterScreen'
import DiaryScreen from './screens/diary/DiaryScreen'
import DiaryDetailScreen from './screens/diary/DiaryDetailScreen'
import FeedScreen from './screens/feed/FeedScreen'
import ReviewScreen from './screens/review/ReviewScreen'
import AlbumReviewPage from './screens/review/AlbumReviewPage'
import ProfileScreen from './screens/profile/ProfileScreen'
import type { RecordRes } from './api/records'
import type { AlbumSearchRes } from './api/albums'
import type { FeedTab } from './screens/feed/FeedScreen'

type Tab = 'diary' | 'feed' | 'review' | 'profile'
type AuthMode = 'login' | 'register'

export default function App() {
  const { isLoggedIn, isInitializing, username } = useAuth()

  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [tab, setTab] = useState<Tab>('feed')
  const [diaryDetail, setDiaryDetail] = useState<RecordRes | null>(null)
  const [albumPage, setAlbumPage] = useState<AlbumSearchRes | null>(null)
  const [viewingUsername, setViewingUsername] = useState<string | null>(null)
  const [feedTab, setFeedTab] = useState<FeedTab>('following')

  // ── 브라우저 뒤로가기 지원 (History API) ──
  const subPageRef = useRef(false)

  // 서브 페이지 진입 시 히스토리 추가 (메인 → 서브 전환 시 1회만)
  const enterSubPage = () => {
    if (!subPageRef.current) {
      window.history.pushState(null, '')
      subPageRef.current = true
    }
  }

  // 메인 탭으로 복귀 — 모든 서브 페이지 상태 초기화
  const goBackToMain = useCallback(() => {
    subPageRef.current = false
    setViewingUsername(null)
    setAlbumPage(null)
    setDiaryDetail(null)
  }, [])

  // 브라우저 뒤로가기 이벤트 핸들링
  useEffect(() => {
    const handlePopState = () => goBackToMain()
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [goBackToMain])

  // sonner toast 헬퍼
  const showToast = (msg: string) => toast(msg)

  // 내 프로필이면 탭 전환, 다른 유저면 프로필 페이지 열기
  const openProfile = (u: string) => {
    if (u === username) {
      setTab('profile')
      if (subPageRef.current) window.history.back()
      else { setAlbumPage(null); setViewingUsername(null) }
    } else {
      enterSubPage()
      setViewingUsername(u)
      setAlbumPage(null)
    }
  }

  // 토큰 검증 완료 전 — 로그인/메인 화면 깜빡임 방지
  if (isInitializing) {
    return <Shell><div style={{ flex: 1 }} /></Shell>
  }

  // 로그인 전
  if (!isLoggedIn) {
    return (
      <Shell>
        {authMode === 'login'
          ? <LoginScreen onSwitch={() => setAuthMode('register')} />
          : <RegisterScreen onSwitch={() => setAuthMode('login')} />
        }
      </Shell>
    )
  }

  // 다른 유저 프로필 페이지
  if (viewingUsername) {
    return (
      <Shell>
        <ProfileScreen
          viewingUsername={viewingUsername}
          onBack={() => window.history.back()}
          onOpenAlbum={(a) => { setViewingUsername(null); setAlbumPage(a) }}
          onOpenProfile={openProfile}
        />
      </Shell>
    )
  }

  // 앨범 상세 페이지
  if (albumPage) {
    return (
      <Shell>
        <AlbumReviewPage
          album={albumPage}
          onBack={() => window.history.back()}
          onOpenAlbum={(a) => setAlbumPage(a)}
          onOpenProfile={(u) => { setAlbumPage(null); openProfile(u) }}
          showToast={showToast}
        />
      </Shell>
    )
  }

  // 일기 상세 페이지
  if (diaryDetail) {
    return (
      <Shell>
        <DiaryDetailScreen
          record={diaryDetail}
          onBack={() => window.history.back()}
          onDeleted={() => { setTab('diary'); window.history.back() }}
          onUpdated={(updated) => setDiaryDetail(updated)}
          showToast={showToast}
        />
      </Shell>
    )
  }

  // 메인 탭 뷰
  return (
    <Shell>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tab === 'diary'   && <DiaryScreen onOpenDetail={(r) => { enterSubPage(); setDiaryDetail(r) }} />}
        {tab === 'feed'    && <FeedScreen onOpenAlbum={(a) => { enterSubPage(); setAlbumPage(a) }} onOpenProfile={openProfile} feedTab={feedTab} setFeedTab={setFeedTab} />}
        {tab === 'review'  && <ReviewScreen onOpenAlbum={(a) => { enterSubPage(); setAlbumPage(a) }} />}
        {tab === 'profile' && <ProfileScreen onOpenAlbum={(a) => { enterSubPage(); setAlbumPage(a) }} onOpenProfile={openProfile} />}
      </div>
      <TabBar tab={tab} setTab={setTab} />
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ECECEE' }}>
      <div style={{
        width: '100%', maxWidth: 430, height: '100%',
        background: '#fff', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 24px 64px rgba(0,0,0,0.12)',
      }}>
        <div style={{ height: 'env(safe-area-inset-top, 44px)', background: '#fff', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
