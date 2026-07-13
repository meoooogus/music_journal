package com.musicjournal.musicjournal.domain.review.entity;

import com.musicjournal.musicjournal.domain.auth.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

// 사용자별 리뷰 조회 전용 리포지토리 — 프로필(ProfileService)/통계(StatsService)에서 소비 (관심사 분리)
public interface AlbumReviewUserRepository extends JpaRepository<AlbumReview, Long> {

    @Query("SELECT r FROM AlbumReview r JOIN FETCH r.album WHERE r.user = :user ORDER BY r.createdAt DESC")
    List<AlbumReview> findByUserOrderByCreatedAtDesc(@Param("user") User user);     // 내림차순

    @Query("SELECT r FROM AlbumReview r JOIN FETCH r.album WHERE r.user = :user ORDER BY r.rating DESC")
    List<AlbumReview> findTopRatedByUser(@Param("user") User user, Pageable pageable);
}
