import client from './client'

// 팔로워/팔로잉 목록 아이템
export interface FollowUserRes {
  username: string
  nickname: string | null
}

export const followApi = {
  // 팔로우
  follow: (username: string) =>
    client.post(`/users/${username}/follow`),

  // 언팔로우
  unfollow: (username: string) =>
    client.delete(`/users/${username}/follow`),

  // 팔로워 목록
  followers: (username: string) =>
    client.get<FollowUserRes[]>(`/users/${username}/followers`).then((r) => r.data),

  // 팔로잉 목록
  followings: (username: string) =>
    client.get<FollowUserRes[]>(`/users/${username}/followings`).then((r) => r.data),
}
