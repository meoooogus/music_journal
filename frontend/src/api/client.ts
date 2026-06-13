import axios from 'axios'

// axios 인스턴스 — 모든 API 요청의 기반
// 개발: Vite proxy 사용 (baseURL 불필요), 프로덕션: 환경변수로 API 서버 지정
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
})

// 요청 인터셉터: Authorization 헤더 자동 주입
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 응답 인터셉터: 401 발생 시 refresh 토큰으로 재시도
let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    // 401이 아니거나, 이미 재시도했거나, 인증 요청 자체인 경우 그냥 reject
    // 로그인/회원가입 등 /auth/ 요청의 401은 refresh 대상이 아님
    if (error.response?.status !== 401 || original._retry || original.url?.startsWith('/auth/')) {
      return Promise.reject(error)
    }

    // 이미 refresh 중이면 큐에 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return client(original)
      })
    }

    original._retry = true
    isRefreshing = true

    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      // 리프레시 토큰 없음 → 로그아웃
      clearTokens()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || ''}/auth/refresh`, { refreshToken })
      saveTokens(data.accessToken, data.refreshToken)

      // 대기 중이던 요청들 재시도
      pendingQueue.forEach((p) => p.resolve(data.accessToken))
      pendingQueue = []

      original.headers.Authorization = `Bearer ${data.accessToken}`
      return client(original)
    } catch (refreshError) {
      pendingQueue.forEach((p) => p.reject(refreshError))
      pendingQueue = []
      clearTokens()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export function saveTokens(access: string, refresh: string) {
  localStorage.setItem('accessToken', access)
  localStorage.setItem('refreshToken', refresh)
}

export function clearTokens() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export function getAccessToken() {
  return localStorage.getItem('accessToken')
}

export default client
