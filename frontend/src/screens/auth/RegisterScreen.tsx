import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/auth'
import { EyeIcon, EyeOffIcon, CheckIcon } from '../../components/Icon'
import Button from '../../components/Button'

interface Props {
  onSwitch: () => void
}

export default function RegisterScreen({ onSwitch }: Props) {
  const { signup } = useAuth()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  // 실시간 중복 확인 상태
  const [usernameAvail, setUsernameAvail] = useState<boolean | null>(null)
  const [emailAvail, setEmailAvail] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)

  // 유효성 검사
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const usernameOk = /^[a-z0-9_]{3,20}$/.test(username)
  const nicknameOk = nickname.trim().length >= 1
  const passwordOk = password.length >= 8
  const canSubmit = emailOk && usernameOk && nicknameOk && passwordOk
    && usernameAvail === true && emailAvail === true

  // username 실시간 중복 확인 (debounce 400ms)
  useEffect(() => {
    setUsernameAvail(null)
    if (!usernameOk) return
    setCheckingUsername(true)
    const timer = setTimeout(async () => {
      try {
        const { available } = await authApi.checkUsername(username)
        setUsernameAvail(available)
      } catch {
        setUsernameAvail(null)
      } finally {
        setCheckingUsername(false)
      }
    }, 400)
    return () => { clearTimeout(timer); setCheckingUsername(false) }
  }, [username])

  // email 실시간 중복 확인 (debounce 400ms)
  useEffect(() => {
    setEmailAvail(null)
    if (!emailOk) return
    setCheckingEmail(true)
    const timer = setTimeout(async () => {
      try {
        const { available } = await authApi.checkEmail(email)
        setEmailAvail(available)
      } catch {
        setEmailAvail(null)
      } finally {
        setCheckingEmail(false)
      }
    }, 400)
    return () => { clearTimeout(timer); setCheckingEmail(false) }
  }, [email])

  const handleSubmit = async () => {
    if (!canSubmit || loading) return
    setServerError('')
    setLoading(true)
    try {
      await signup({ email, username, nickname, password })
    } catch (e: unknown) {
      const data = (e as { response?: { data?: { message?: string } } })?.response?.data
      setServerError(data?.message ?? '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0 24px', background: '#fff' }}>
      {/* 브랜드 */}
      <div style={{ paddingTop: 24 }}>
        <img src="/logo.png" alt="MJZ" style={{ height: 36, objectFit: 'contain' }} />
      </div>

      {/* 타이틀 */}
      <div style={{ padding: '40px 0 32px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(55,56,60,0.45)', letterSpacing: '0.045em', textTransform: 'uppercase' }}>
          Create account
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#17171A', letterSpacing: '-0.027em', marginTop: 6, lineHeight: 1.15 }}>
          음악과 함께<br />시작해볼까요.
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(55,56,60,0.55)', marginTop: 8 }}>
          Let's set up your account.
        </div>
      </div>

      {/* 폼 */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 16 }}>
          {/* 이메일 */}
          <Field
            label="이메일"
            status={!email ? 'idle' : !emailOk ? 'error' : emailAvail === true ? 'ok' : emailAvail === false ? 'error' : 'idle'}
            helper={
              !email ? undefined
                : !emailOk ? '올바른 이메일 형식을 입력해주세요.'
                : checkingEmail ? '확인 중...'
                : emailAvail === false ? '이미 사용 중인 이메일입니다.'
                : undefined
            }
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              autoComplete="email"
              style={inputStyle(!email ? 'idle' : !emailOk ? 'error' : emailAvail === true ? 'ok' : emailAvail === false ? 'error' : 'idle')}
            />
          </Field>

          {/* 아이디 */}
          <Field
            label="아이디"
            status={!username ? 'idle' : !usernameOk ? 'error' : usernameAvail === true ? 'ok' : usernameAvail === false ? 'error' : 'idle'}
            helper={
              !username ? undefined
                : !usernameOk ? '영문 소문자, 숫자, _ 조합 3–20자'
                : checkingUsername ? '확인 중...'
                : usernameAvail === false ? '이미 사용 중인 아이디입니다.'
                : undefined
            }
          >
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'rgba(55,56,60,0.4)' }}>@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="username"
                autoComplete="username"
                style={{ ...inputStyle(!username ? 'idle' : !usernameOk ? 'error' : usernameAvail === true ? 'ok' : usernameAvail === false ? 'error' : 'idle'), paddingLeft: 30 }}
              />
              {usernameAvail === true && (
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#00BF40' }}>
                  <CheckIcon size={16} color="#00BF40" />
                </span>
              )}
            </div>
          </Field>

          {/* 닉네임 */}
          <Field
            label="닉네임"
            status={nickname ? (nicknameOk ? 'ok' : 'error') : 'idle'}
          >
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="표시될 이름을 입력하세요"
              autoComplete="nickname"
              style={inputStyle(nickname ? (nicknameOk ? 'ok' : 'error') : 'idle')}
            />
          </Field>

          {/* 비밀번호 */}
          <Field
            label="비밀번호"
            status={password ? (passwordOk ? 'ok' : 'error') : 'idle'}
            helper={password && !passwordOk ? '비밀번호는 8자 이상이어야 합니다.' : undefined}
          >
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상 입력하세요"
                autoComplete="new-password"
                style={{ ...inputStyle(password ? (passwordOk ? 'ok' : 'error') : 'idle'), paddingRight: 44 }}
              />
              <button
                onClick={() => setShowPw((v) => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, color: 'rgba(55,56,60,0.4)', cursor: 'pointer' }}
              >
                {showPw ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </Field>

          {serverError && (
            <div style={{ fontSize: 13, color: '#FF4242' }}>{serverError}</div>
          )}

          <Button full disabled={!canSubmit || loading} onClick={handleSubmit}>
            {loading ? '가입 중...' : '시작하기'}
          </Button>
        </div>
      </div>

      {/* 하단 전환 */}
      <div style={{ padding: '16px 0 28px', borderTop: '1px solid rgba(112,115,124,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, color: 'rgba(55,56,60,0.55)' }}>이미 계정이 있으신가요?</span>
        <button onClick={onSwitch} style={{ fontSize: 13, fontWeight: 600, color: '#17171A', background: 'none', border: 'none', cursor: 'pointer' }}>
          로그인
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
