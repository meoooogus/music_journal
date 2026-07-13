package com.musicjournal.musicjournal.domain.review.entity;

import com.musicjournal.musicjournal.domain.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

// 리뷰 CRUD + 앨범 단위 집계(평균/개수) — 리뷰 본연의 관심사만 담당
// 피드/트렌딩/사용자별 조회는 AlbumReviewFeedRepository / -TrendingRepository / -UserRepository로 분리
public interface AlbumReviewRepository extends JpaRepository<AlbumReview, Long> {

    // JOIN FETCH r.user: ResDto가 user.username을 읽으므로 미포함 시 리뷰 N건마다 user 프록시 초기화 쿼리(N+1) 발생
    // ORDER BY createdAt DESC: 정렬 미지정 시 순서 비결정적 → 최신순 고정
    @Query("SELECT DISTINCT r FROM AlbumReview r JOIN FETCH r.user LEFT JOIN FETCH r.recommendations " +
           "WHERE r.album.spotifyAlbumId = :spotifyAlbumId ORDER BY r.createdAt DESC")
    List<AlbumReview> findReviewsBySpotifyAlbumId(@Param("spotifyAlbumId") String spotifyAlbumId);

    @Query("SELECT DISTINCT r FROM AlbumReview r LEFT JOIN FETCH r.recommendations WHERE r.user = :user AND r.album.spotifyAlbumId = :spotifyAlbumId")
    Optional<AlbumReview> findMyReview(@Param("user") User user, @Param("spotifyAlbumId") String spotifyAlbumId);

    // 앨범별 평균 평점
    @Query("SELECT AVG(r.rating) FROM AlbumReview r WHERE r.album.spotifyAlbumId = :spotifyAlbumId")
    Double findAvgRatingBySpotifyAlbumId(@Param("spotifyAlbumId") String spotifyAlbumId);

    // 앨범별 리뷰 수
    @Query("SELECT COUNT(r) FROM AlbumReview r WHERE r.album.spotifyAlbumId = :spotifyAlbumId")
    Long countBySpotifyAlbumId(@Param("spotifyAlbumId") String spotifyAlbumId);
}
