package com.musicjournal.musicjournal.domain.album.service;

import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.review.dto.AlbumReviewResDto;
import com.musicjournal.musicjournal.domain.review.entity.AlbumReview;
import com.musicjournal.musicjournal.domain.review.entity.AlbumReviewRepository;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

// 앨범 상세 조회 시 DB 읽기 전용 쿼리 담당 — 외부 API 호출과 트랜잭션 분리 목적
@Service
@RequiredArgsConstructor
public class AlbumDetailQueryService {
    private final AlbumReviewRepository albumReviewRepository;

    // 상세에 임베드하는 리뷰 preview 상한 — 무한 리스트 방지 (전체 개수는 reviewCount로 별도 노출)
    private static final int PREVIEW_SIZE = 20;

    @Transactional(readOnly = true)
    public ReviewSummary getReviewSummary(String spotifyAlbumId, User user) {
        Double avgRating = albumReviewRepository.findAvgRatingBySpotifyAlbumId(spotifyAlbumId);
        Long reviewCount = albumReviewRepository.countBySpotifyAlbumId(spotifyAlbumId);

        // 최신 N개만 preview로 임베드
        List<AlbumReview> recent = albumReviewRepository
                .findRecentReviews(spotifyAlbumId, PageRequest.of(0, PREVIEW_SIZE));

        // 내 리뷰가 최신 N개 밖으로 밀려도 유실되지 않도록 항상 최상단에 포함 (없으면 skip)
        Optional<AlbumReview> myReview = (user == null)
                ? Optional.empty()
                : albumReviewRepository.findMyReview(user, spotifyAlbumId);

        List<AlbumReviewResDto> reviews = new ArrayList<>();
        myReview.ifPresent(mine -> reviews.add(AlbumReviewResDto.from(mine)));
        recent.stream()
                // 내 리뷰가 recent에도 있으면 중복 제거
                .filter(r -> myReview.isEmpty() || !r.getReviewId().equals(myReview.get().getReviewId()))
                .map(AlbumReviewResDto::from)
                .forEach(reviews::add);

        return ReviewSummary.builder()
                .avgRating(avgRating)
                .reviewCount(reviewCount)
                .reviews(reviews)
                .build();
    }

    @Getter
    @Builder
    public static class ReviewSummary {
        private final Double avgRating;
        private final Long reviewCount;
        private final List<AlbumReviewResDto> reviews;
    }
}
