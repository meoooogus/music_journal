package com.musicjournal.musicjournal.domain.review.entity;

import com.musicjournal.musicjournal.domain.review.dto.AlbumReviewProjections;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

// 트렌딩 집계 전용 리포지토리 — AlbumReviewService.getTrending에서만 소비 (관심사 분리)
public interface AlbumReviewTrendingRepository extends JpaRepository<AlbumReview, Long> {

    // 최근 N일 리뷰 수 TOP N
    @Query("SELECT r.album.spotifyAlbumId as spotifyAlbumId, r.album.albumName as albumName, " +
           "r.album.artistName as artistName, r.album.artworkUrl as artworkUrl, COUNT(r) as reviewCount " +
           "FROM AlbumReview r WHERE r.createdAt >= :since " +
           "GROUP BY r.album ORDER BY COUNT(r) DESC")
    List<AlbumReviewProjections.MostReviewedProjection> findMostReviewed(@Param("since") LocalDateTime since, Pageable pageable);

    // 최근 N일 평균 평점 TOP N
    @Query("SELECT r.album.spotifyAlbumId as spotifyAlbumId, r.album.albumName as albumName, " +
           "r.album.artistName as artistName, r.album.artworkUrl as artworkUrl, AVG(r.rating) as avgRating " +
           "FROM AlbumReview r WHERE r.createdAt >= :since " +
           "GROUP BY r.album ORDER BY AVG(r.rating) DESC")
    List<AlbumReviewProjections.HighestRatedProjection> findHighestRated(@Param("since") LocalDateTime since, Pageable pageable);
}
