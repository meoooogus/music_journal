package com.musicjournal.musicjournal.domain.review.entity;

import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.review.dto.AlbumReviewProjections;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AlbumReviewRepository extends JpaRepository<AlbumReview, Long> {

    @Query("SELECT DISTINCT r FROM AlbumReview r LEFT JOIN FETCH r.recommendations WHERE r.album.spotifyAlbumId = :spotifyAlbumId")
    List<AlbumReview> findReviewsBySpotifyAlbumId(@Param("spotifyAlbumId") String spotifyAlbumId);

    @Query("SELECT DISTINCT r FROM AlbumReview r LEFT JOIN FETCH r.recommendations WHERE r.user = :user AND r.album.spotifyAlbumId = :spotifyAlbumId")
    Optional<AlbumReview> findMyReview(@Param("user") User user, @Param("spotifyAlbumId") String spotifyAlbumId);

    @Query("SELECT r FROM AlbumReview r JOIN FETCH r.album WHERE r.user = :user ORDER BY r.createdAt DESC")
    List<AlbumReview> findByUserOrderByCreatedAtDesc(@Param("user") User user);     // 내림차순

    @Query("SELECT r FROM AlbumReview r JOIN FETCH r.album WHERE r.user = :user ORDER BY r.rating DESC")
    List<AlbumReview> findTopRatedByUser(@Param("user") User user, Pageable pageable);

    // 앨범별 평균 평점
    @Query("SELECT AVG(r.rating) FROM AlbumReview r WHERE r.album.spotifyAlbumId = :spotifyAlbumId")
    Double findAvgRatingBySpotifyAlbumId(@Param("spotifyAlbumId") String spotifyAlbumId);

    // 앨범별 리뷰 수
    @Query("SELECT COUNT(r) FROM AlbumReview r WHERE r.album.spotifyAlbumId = :spotifyAlbumId")
    Long countBySpotifyAlbumId(@Param("spotifyAlbumId") String spotifyAlbumId);

    // 이번 달 리뷰 수 TOP N
    @Query("SELECT r.album.spotifyAlbumId as spotifyAlbumId, r.album.albumName as albumName, " +
           "r.album.artistName as artistName, r.album.artworkUrl as artworkUrl, COUNT(r) as reviewCount " +
           "FROM AlbumReview r WHERE YEAR(r.createdAt) = :year AND MONTH(r.createdAt) = :month " +
           "GROUP BY r.album ORDER BY COUNT(r) DESC")
    List<AlbumReviewProjections.MostReviewedProjection> findMostReviewed(@Param("year") int year, @Param("month") int month, Pageable pageable);

    // 이번 달 평균 평점 TOP N
    @Query("SELECT r.album.spotifyAlbumId as spotifyAlbumId, r.album.albumName as albumName, " +
           "r.album.artistName as artistName, r.album.artworkUrl as artworkUrl, AVG(r.rating) as avgRating " +
           "FROM AlbumReview r WHERE YEAR(r.createdAt) = :year AND MONTH(r.createdAt) = :month " +
           "GROUP BY r.album ORDER BY AVG(r.rating) DESC")
    List<AlbumReviewProjections.HighestRatedProjection> findHighestRated(@Param("year") int year, @Param("month") int month, Pageable pageable);
}
