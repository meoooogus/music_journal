import client from './client'

export interface TrackReq {
  spotifyId: string
  title: string
  artistName: string
  artistId: string
  albumName: string
  albumId: string
  artworkUrl: string | null
  durationMs: number
}

export interface RecordReq {
  track: TrackReq
  recordedDate: string // 'YYYY-MM-DD'
  comment?: string
  weather?: string
}

export interface RecordUpdateReq {
  comment?: string
  recordedDate: string
  weather?: string
}

export interface RecordRes {
  recordId: number
  comment: string | null
  recordedDate: string
  trackTitle: string
  albumName: string
  artistName: string
  artworkUrl: string | null
  weather: string | null
}

export const recordsApi = {
  list: (date?: string) =>
    client
      .get<RecordRes[]>('/records', { params: date ? { date } : undefined })
      .then((r) => r.data),

  // 월별 조회 — 캘린더 뷰용
  listByMonth: (year: number, month: number) =>
    client
      .get<RecordRes[]>('/records', { params: { year, month } })
      .then((r) => r.data),

  get: (id: number) =>
    client.get<RecordRes>(`/records/${id}`).then((r) => r.data),

  create: (body: RecordReq) =>
    client.post<RecordRes>('/records', body).then((r) => r.data),

  update: (id: number, body: RecordUpdateReq) =>
    client.put<RecordRes>(`/records/${id}`, body).then((r) => r.data),

  delete: (id: number) =>
    client.delete(`/records/${id}`).then((r) => r.data),
}
