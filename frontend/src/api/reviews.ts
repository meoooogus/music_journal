import client from './client'

export interface RecommendationReq {
  spotifyAlbumId: string
  albumName: string
  artistName: string
  artistId: string
  artworkUrl: string | null
  releaseDate?: string
  totalTracks?: number
}

export interface ReviewReq {
  rating: number
  content?: string
  recommendations?: RecommendationReq[]
}

export interface RecommendationRes {
  spotifyAlbumId: string
  albumName: string
  artistName: string
  artworkUrl: string | null
}

export interface ReviewRes {
  reviewId: number
  username: string
  rating: number
  content: string | null
  createdAt: string
  recommendations: RecommendationRes[]
}

export const reviewsApi = {
  list: (spotifyAlbumId: string) =>
    client
      .get<ReviewRes[]>(`/albums/${spotifyAlbumId}/reviews`)
      .then((r) => r.data),

  // 내 리뷰 upsert — 멱등 연산이므로 PUT, 대상은 단일 self-resource이므로 /me
  upsert: (spotifyAlbumId: string, body: ReviewReq) =>
    client
      .put<ReviewRes>(`/albums/${spotifyAlbumId}/reviews/me`, body)
      .then((r) => r.data),

  // 내 리뷰만 삭제 — 컬렉션이 아닌 단일 self-resource 대상이므로 /me
  delete: (spotifyAlbumId: string) =>
    client.delete(`/albums/${spotifyAlbumId}/reviews/me`).then((r) => r.data),
}
