import client from './client'

export interface FeedRecommendation {
  spotifyAlbumId: string
  albumName: string
  artistName: string
  artworkUrl: string | null
}

export interface FeedItem {
  reviewId: number
  username: string
  nickname: string | null
  spotifyAlbumId: string
  albumName: string
  artistName: string
  artworkUrl: string | null
  rating: number
  content: string | null
  createdAt: string
  recommendations: FeedRecommendation[]
}

export interface PageRes<T> {
  content: T[]
  totalPages: number
  totalElements: number
  last: boolean
  number: number  // 현재 페이지 (0-based)
}

export const feedApi = {
  // 팔로잉 피드
  following: (page = 0, size = 10) =>
    client.get<PageRes<FeedItem>>('/feed/following', { params: { page, size } })
      .then((r) => r.data),

  // 최신 피드 (Explore)
  latest: (page = 0, size = 10) =>
    client.get<PageRes<FeedItem>>('/feed/latest', { params: { page, size } })
      .then((r) => r.data),
}
