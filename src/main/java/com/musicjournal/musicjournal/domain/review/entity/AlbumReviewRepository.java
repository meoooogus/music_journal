package com.musicjournal.musicjournal.domain.review.entity;

import com.musicjournal.musicjournal.domain.auth.entity.User;
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
}
