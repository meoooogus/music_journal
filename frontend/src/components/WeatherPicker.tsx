// 날씨 태그 선택기 — 백엔드 Weather enum과 1:1 매핑

export type WeatherKey =
  | 'SUNNY' | 'CLOUDY' | 'RAINY' | 'SNOWY' | 'WINDY'
  | 'FOGGY' | 'STORMY' | 'HOT' | 'WARM' | 'COOL' | 'CHILLY'

interface WeatherOption {
  key: WeatherKey
  emoji: string
  label: string
}

export const WEATHER_OPTIONS: WeatherOption[] = [
  { key: 'SUNNY',  emoji: '☀️', label: '맑음' },
  { key: 'CLOUDY', emoji: '☁️', label: '흐림' },
  { key: 'RAINY',  emoji: '🌧️', label: '비' },
  { key: 'SNOWY',  emoji: '❄️', label: '눈' },
  { key: 'WINDY',  emoji: '💨', label: '바람' },
  { key: 'FOGGY',  emoji: '🌫️', label: '안개' },
  { key: 'STORMY', emoji: '⛈️', label: '폭풍' },
  { key: 'HOT',    emoji: '🔥', label: '더움' },
  { key: 'WARM',   emoji: '🌤️', label: '따뜻' },
  { key: 'COOL',   emoji: '🍂', label: '선선' },
  { key: 'CHILLY', emoji: '🥶', label: '쌀쌀' },
]

// key로 빠르게 조회할 수 있도록 맵 export
export const WEATHER_MAP = Object.fromEntries(
  WEATHER_OPTIONS.map((o) => [o.key, o])
) as Record<WeatherKey, WeatherOption>

interface Props {
  selected: WeatherKey | null
  onSelect: (key: WeatherKey | null) => void
}

export default function WeatherPicker({ selected, onSelect }: Props) {
  return (
    <div
      className="hide-scrollbar"
      style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}
    >
      {WEATHER_OPTIONS.map((opt) => {
        const active = selected === opt.key
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => {
              // iOS: 키보드가 올라와 있으면 터치 좌표 어긋남 방지 — blur + 선택을 같은 틱에서 처리
              if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
              onSelect(active ? null : opt.key)
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 10px', borderRadius: 999, flexShrink: 0,
              border: active ? '1.5px solid #17171A' : '1px solid rgba(112,115,124,0.18)',
              background: active ? '#17171A' : '#fff',
              color: active ? '#fff' : '#37383C',
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: 14 }}>{opt.emoji}</span>
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// 날씨 뱃지 — 목록/상세에서 표시용
export function WeatherBadge({ weather }: { weather: string }) {
  const opt = WEATHER_MAP[weather as WeatherKey]
  if (!opt) return null

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '3px 8px', background: '#F4F4F5', borderRadius: 999,
      fontSize: 11, fontWeight: 500, color: '#37383C',
    }}>
      <span style={{ fontSize: 12 }}>{opt.emoji}</span>
      {opt.label}
    </span>
  )
}
