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

  upsert: (spotifyAlbumId: string, body: ReviewReq) =>
    client
      .post<ReviewRes>(`/albums/${spotifyAlbumId}/reviews`, body)
      .then((r) => r.data),

  delete: (spotifyAlbumId: string) =>
    client.delete(`/albums/${spotifyAlbumId}/reviews`).then((r) => r.data),
}
