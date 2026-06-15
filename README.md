<p align="center">
  <img src="frontend/public/logo-readme.jpg" alt="mjz logo" width="120" />
</p>

# mjz — Music Diary & Review

나만의 음악 일기와 앨범 평론을 기록하는 서비스입니다.
Spotify에서 트랙을 검색하고, 날짜별로 감상을 남기고, 앨범을 탐색하여 앨범 리뷰를 공유할 수 있습니다.

## 배포 주소

> https://mjz-production.up.railway.app
>
> 서비스 이용을 위해 **회원가입**이 필요합니다.

## 주요 기능

- **음악 일기** — 매일의 감상을 기록하며 나만의 음악 취향을 정리할 수 있습니다
- **앨범 리뷰** — 앨범에 평점과 코멘트를 남기고, 내 감상을 하나의 평론으로 완성할 수 있습니다
- **앨범 탐색** — 이번 달 화제의 앨범과 다른 유저들의 리뷰를 통해 새로운 음악을 발견할 수 있습니다
- **피드 & 팔로우** — 취향이 비슷한 유저를 팔로우하고, 서로의 감상을 공유할 수 있습니다

## 기술 스택

| 구분 | 기술 |
|---|---|
| Backend | Spring Boot 3, Spring Security, JPA |
| Frontend | React, TypeScript, Vite |
| Database | MySQL |
| Auth | JWT (Access + Refresh Token) |
| External API | Spotify Web API |
| Deploy | Railway, Docker |
