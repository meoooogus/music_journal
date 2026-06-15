import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { getAccessToken, saveTokens, clearTokens } from '../api/client'
import { authApi, type LoginReq, type SignupReq } from '../api/auth'
import { profileApi } from '../api/profile'

interface AuthState {
  isLoggedIn: boolean
  isInitializing: boolean
  username: string | null
  login: (body: LoginReq) => Promise<void>
  signup: (body: SignupReq) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [username, setUsername] = useState<string | null>(null)

  // 앱 로드 시 토큰 유효성 서버 검증 — 만료 or refresh 실패 시 자동 클리어
  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setIsInitializing(false)
      return
    }

    profileApi.me()
      .then((p) => {
        setUsername(p.username)
        localStorage.setItem('username', p.username)
        setIsLoggedIn(true)
      })
      .catch(() => {
        clearTokens()
        localStorage.removeItem('username')
        setIsLoggedIn(false)
      })
      .finally(() => setIsInitializing(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 다른 탭 로그아웃 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'accessToken') setIsLoggedIn(!!e.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const login = async (body: LoginReq) => {
    const res = await authApi.login(body)
    saveTokens(res.accessToken, res.refreshToken)
    // 로그인 직후 username 조회
    const profile = await profileApi.me()
    setUsername(profile.username)
    localStorage.setItem('username', profile.username)
    setIsLoggedIn(true)
  }

  const signup = async (body: SignupReq) => {
    await authApi.signup(body)
    await login({ email: body.email, password: body.password })
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // 서버 호출 실패해도 로컬 정리는 진행
    }
    clearTokens()
    localStorage.removeItem('username')
    setIsLoggedIn(false)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isInitializing, username, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
