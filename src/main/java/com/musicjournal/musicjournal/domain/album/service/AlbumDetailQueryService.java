package com.musicjournal.musicjournal.domain.album.service;

import com.musicjournal.musicjournal.domain.review.dto.AlbumReviewResDto;
import com.musicjournal.musicjournal.domain.review.entity.AlbumReviewRepository;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// 앨범 상세 조회 시 DB 읽기 전용 쿼리 담당 — 외부 API 호출과 트랜잭션 분리 목적
@Service
@RequiredArgsConstructor
public class AlbumDetailQueryService {
    private final AlbumReviewRepository albumReviewRepository;

    @Transactional(readOnly = true)
    public ReviewSummary getReviewSummary(String spotifyAlbumId) {
        Double avgRating = albumReviewRepository.findAvgRatingBySpotifyAlbumId(spotifyAlbumId);
        Long reviewCount = albumReviewRepository.countBySpotifyAlbumId(spotifyAlbumId);
        List<AlbumReviewResDto> reviews = albumReviewRepository
                .findReviewsBySpotifyAlbumId(spotifyAlbumId).stream()
                .map(AlbumReviewResDto::from)
                .toList();

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
