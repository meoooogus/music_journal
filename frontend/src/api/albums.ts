import client from './client'

export interface TrendingRes {
  mostReviewed: {
    spotifyAlbumId: string
    albumName: string
    artistName: string
    artworkUrl: string | null
    reviewCount: number
  }[]
  highestRated: {
    spotifyAlbumId: string
    albumName: string
    artistName: string
    artworkUrl: string | null
    avgRating: number
  }[]
}

// 프론트 공통 앨범 모델 — 백엔드 AlbumResDto 필드를 그대로 사용
export interface AlbumSearchRes {
  spotifyId: string       // ← 백엔드 spotifyAlbumId 매핑
  title: string           // ← 백엔드 albumName 매핑
  artistName: string
  artistId: string
  artworkUrl: string | null
  releaseDate: string
  totalTracks: number
}

export interface TrackSearchRes {
  spotifyId: string
  title: string
  artistName: string
  artistId: string
  albumName: string
  albumId: string
  artworkUrl: string | null
  durationMs: number
}

// GET /albums/{spotifyAlbumId} 응답 — 앨범 메타 + 리뷰 + 트랙 통합
export interface AlbumTrackRes {
  spotifyId: string
  discNumber: number
  trackNumber: number
  title: string
  artistName: string
  durationMs: number
}

export interface AlbumDetailRes {
  spotifyAlbumId: string
  albumName: string
  artistName: string
  artworkUrl: string | null
  releaseDate: string
  totalTracks: number
  spotifyUrl: string | null
  avgRating: number | null
  reviewCount: number | null
  reviews: import('./reviews').ReviewRes[]
  tracks: AlbumTrackRes[]
}

// 백엔드 AlbumResDto 원본 형태
interface BackendAlbumRes {
  spotifyAlbumId: string
  albumName: string
  artistName: string
  artistId: string
  artworkUrl: string | null
  releaseDate: string
  totalTracks: number
}

function mapAlbum(a: BackendAlbumRes): AlbumSearchRes {
  return {
    spotifyId: a.spotifyAlbumId,
    title: a.albumName,
    artistName: a.artistName,
    artistId: a.artistId,
    artworkUrl: a.artworkUrl,
    releaseDate: a.releaseDate ?? '',
    totalTracks: a.totalTracks ?? 0,
  }
}

export const albumsApi = {
  // 앨범 상세 조회 — 메타 + 리뷰 + 트랙 한 번에
  getDetail: (spotifyAlbumId: string) =>
    client.get<AlbumDetailRes>(`/albums/${spotifyAlbumId}`).then((r) => r.data),

  trending: () =>
    client.get<TrendingRes>('/albums/trending').then((r) => r.data),

  // 리뷰 작성 전 앨범을 DB에 upsert — 백엔드가 선행 등록을 요구
  upsert: (spotifyAlbumId: string, album: AlbumSearchRes) =>
    client.put(`/albums/${spotifyAlbumId}`, {
      albumName: album.title,
      artistName: album.artistName,
      artistId: album.artistId,
      artworkUrl: album.artworkUrl,
      releaseDate: album.releaseDate,
      totalTracks: album.totalTracks,
    }),

  searchTracks: (q: string) =>
    client
      .get<TrackSearchRes[]>('/search', { params: { q, type: 'track' } })
      .then((r) => r.data),

  searchAlbums: (q: string) =>
    client
      .get<BackendAlbumRes[]>('/search', { params: { q, type: 'album' } })
      .then((r) => r.data.map(mapAlbum)),
}
