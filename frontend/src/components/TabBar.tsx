import { DiaryIcon, FeedIcon, ReviewIcon, ProfileIcon } from './Icon'

type Tab = 'diary' | 'feed' | 'review' | 'profile'

interface TabBarProps {
  tab: Tab
  setTab: (t: Tab) => void
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'diary', label: '일기' },
  { id: 'feed', label: '피드' },
  { id: 'review', label: '앨범 탐색' },
  { id: 'profile', label: '프로필' },
]

function TabIcon({ id, active }: { id: Tab; active: boolean }) {
  const c = active ? '#17171A' : 'rgba(55,56,60,0.45)'
  if (id === 'diary')   return <DiaryIcon size={22} color={c} filled={active} />
  if (id === 'feed')    return <FeedIcon size={22} color={c} filled={active} />
  if (id === 'review')  return <ReviewIcon size={22} color={c} filled={active} />
  return <ProfileIcon size={22} color={c} filled={active} />
}

export default function TabBar({ tab, setTab }: TabBarProps) {
  return (
    <div style={{
      display: 'flex', borderTop: '1px solid rgba(112,115,124,0.14)',
      background: '#fff', paddingBottom: 'env(safe-area-inset-bottom, 8px)',
    }}>
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '10px 0 6px', gap: 3, background: 'none', border: 'none',
            cursor: 'pointer',
          }}
        >
          <TabIcon id={t.id} active={tab === t.id} />
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: tab === t.id ? '#17171A' : 'rgba(55,56,60,0.45)',
            letterSpacing: '0.02em',
          }}>
            {t.label}
          </span>
        </button>
      ))}
    </div>
  )
}
