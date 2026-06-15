interface RatingChipProps {
  value: number
  size?: 'sm' | 'md'
}

const DIM   = { sm: 42, md: 58 }
const SW    = { sm: 3,  md: 4  }
const FSIZE = { sm: 11, md: 15 }

function getColor(v: number) {
  if (v >= 8) return '#2ecc71'
  if (v >= 5) return '#e8c83a'
  return '#e74c3c'
}

export default function RatingChip({ value, size = 'sm' }: RatingChipProps) {
  const dim  = DIM[size]
  const sw   = SW[size]
  const cx   = dim / 2
  const r    = cx - sw - 1
  const circ = 2 * Math.PI * r
  const arc  = (value / 10) * circ
  const color = getColor(value)

  return (
    <svg
      width={dim} height={dim}
      viewBox={`0 0 ${dim} ${dim}`}
      style={{ flexShrink: 0, display: 'block' }}
    >
      {/* 배경 트랙 */}
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeOpacity={0.15} strokeWidth={sw} />
      {/* 값 아크 */}
      <circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={`${arc} ${circ}`}
        transform={`rotate(-90 ${cx} ${cx})`}
      />
      {/* 숫자 */}
      <text
        x={cx} y={cx}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={FSIZE[size]}
        fontWeight={700}
        fill={color}
        fontFamily="inherit"
      >
        {value.toFixed(1)}
      </text>
    </svg>
  )
}
