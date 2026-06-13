import client from './client'

export interface TopRatedReview {
  spotifyAlbumId: string
  albumName: string
  artistName: string
  artworkUrl: string | null
  rating: number
}

export interface StatsRes {
  totalCount: number
  monthlyCount: number
  topArtists: { artistName: string; artistId: string; count: number }[]
  topAlbums: {
    albumName: string
    albumId: string
    artworkUrl: string | null
    count: number
  }[]
  topRatedReviews: TopRatedReview[]
}

export interface ProfileReview {
  spotifyAlbumId: string
  albumName: string
  artistName: string
  artworkUrl: string | null
  rating: number
  content: string | null
}

export interface ProfileMyRes {
  username: string
  nickname: string | null
  followerCount: number
  followingCount: number
  reviewCount: number
  reviews: ProfileReview[]
  stat: StatsRes
}

export interface ProfileRes {
  username: string
  nickname: string | null
  followerCount: number
  followingCount: number
  reviewCount: number
  reviews: ProfileReview[]
}

export interface ProfileUpdateReq {
  username: string
  nickname: string
}

export const profileApi = {
  me: () => client.get<ProfileMyRes>('/profile/me').then((r) => r.data),

  get: (username: string) =>
    client.get<ProfileRes>(`/profile/${username}`).then((r) => r.data),

  update: (body: ProfileUpdateReq) =>
    client.put('/profile/me', body),
}
