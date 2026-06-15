import client from './client'

export interface LoginReq {
  email: string
  password: string
}

export interface SignupReq {
  email: string
  password: string
  username: string
  nickname: string
}

export interface AuthRes {
  accessToken: string
  refreshToken: string
}

export const authApi = {
  login: (body: LoginReq) =>
    client.post<AuthRes>('/auth/login', body).then((r) => r.data),

  signup: (body: SignupReq) =>
    client.post<string>('/auth/signup', body).then((r) => r.data),

  logout: () =>
    client.post<void>('/auth/logout'),

  checkUsername: (value: string) =>
    client.get<{ available: boolean }>('/auth/check-username', { params: { value } }).then((r) => r.data),

  checkEmail: (value: string) =>
    client.get<{ available: boolean }>('/auth/check-email', { params: { value } }).then((r) => r.data),
}
