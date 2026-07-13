package com.musicjournal.musicjournal.domain.review.entity;

import com.musicjournal.musicjournal.domain.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

// 피드 조회 전용 리포지토리 — FeedService에서만 소비 (관심사 분리)
public interface AlbumReviewFeedRepository extends JpaRepository<AlbumReview, Long> {

    // 팔로잉 피드 — 내가 팔로우한 유저들의 리뷰
    @Query("SELECT r FROM AlbumReview r JOIN FETCH r.user JOIN FETCH r.album " +
           "WHERE r.user IN (SELECT f.following FROM Follow f WHERE f.follower = :user) " +
           "ORDER BY r.createdAt DESC")
    Page<AlbumReview> findFollowingFeed(@Param("user") User user, Pageable pageable);

    // 최신 피드 — 전체 최신 리뷰
    @Query("SELECT r FROM AlbumReview r JOIN FETCH r.user JOIN FETCH r.album " +
           "ORDER BY r.createdAt DESC")
    Page<AlbumReview> findLatestFeed(Pageable pageable);
}
