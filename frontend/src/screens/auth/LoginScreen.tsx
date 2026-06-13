import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { EyeIcon, EyeOffIcon } from '../../components/Icon'
import Button from '../../components/Button'

interface Props {
  onSwitch: () => void
}

export default function LoginScreen({ onSwitch }: Props) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const canSubmit = email.trim() && password.trim()

  const handleSubmit = async () => {
    if (!canSubmit || loading) return
    setError('')
    setLoading(true)
    try {
      await login({ email: email.trim(), password })
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  const emailStatus: FieldStatus = error ? 'error' : 'idle'
  const passwordStatus: FieldStatus = error ? 'error' : 'idle'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0 24px', background: '#fff' }}>
      {/* 브랜드 */}
      <div style={{ paddingTop: 24 }}>
        <img src="/logo.png" alt="MJZ" style={{ height: 36, objectFit: 'contain' }} />
      </div>

      {/* 타이틀 */}
      <div style={{ padding: '40px 0 32px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(55,56,60,0.45)', letterSpacing: '0.045em', textTransform: 'uppercase' }}>
          Sign in
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#17171A', letterSpacing: '-0.027em', marginTop: 6, lineHeight: 1.15 }}>
          Welcome back<br />to mjz.
        </div>
      </div>

      {/* 폼 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="이메일" status={emailStatus}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            autoComplete="email"
            style={inputStyle(emailStatus)}
          />
        </Field>

        <Field label="비밀번호" status={passwordStatus} helper={error || undefined}>
          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{ ...inputStyle(passwordStatus), paddingRight: 44 }}
            />
            <button
              onClick={() => setShowPw((v) => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, color: 'rgba(55,56,60,0.4)', cursor: 'pointer' }}
            >
              {showPw ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
        </Field>

        <Button full disabled={!canSubmit || loading} onClick={handleSubmit}>
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </div>

      {/* 하단 전환 */}
      <div style={{ marginTop: 'auto', padding: '16px 0 28px', borderTop: '1px solid rgba(112,115,124,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, color: 'rgba(55,56,60,0.55)' }}>아직 계정이 없으신가요?</span>
        <button onClick={onSwitch} style={{ fontSize: 13, fontWeight: 600, color: '#17171A', background: 'none', border: 'none', cursor: 'pointer' }}>
          회원가입
        </button>
      </div>
    </div>
  )
}

type FieldStatus = 'idle' | 'ok' | 'error'

function Field({ label, status = 'idle', helper, children }: { label: string; status?: FieldStatus; helper?: string; children: React.ReactNode }) {
  const helperColor = status === 'error' ? '#FF4242' : status === 'ok' ? '#00BF40' : 'rgba(55,56,60,0.55)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#37383C', letterSpacing: '0.01em' }}>{label}</label>
      {children}
      {helper && <span style={{ fontSize: 12, color: helperColor }}>{helper}</span>}
    </div>
  )
}

function inputStyle(status: FieldStatus): React.CSSProperties {
  const borderColor =
    status === 'error' ? '#FF4242' : status === 'ok' ? '#00BF40' : 'rgba(112,115,124,0.22)'
  return {
    width: '100%', height: 48, padding: '0 14px',
    borderRadius: 8, fontSize: 15, fontWeight: 500,
    border: `1.5px solid ${borderColor}`,
    outline: 'none', background: '#fff', color: '#17171A',
    transition: 'border-color 0.15s',
  }
}
