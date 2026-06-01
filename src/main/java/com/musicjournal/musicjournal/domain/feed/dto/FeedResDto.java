package com.musicjournal.musicjournal.domain.feed.dto;

import com.musicjournal.musicjournal.domain.review.entity.AlbumReview;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class FeedResDto {

    private Long reviewId;
    private String username;
    private String nickname;
    private String spotifyAlbumId;
    private String albumName;
    private String artistName;
    private String artworkUrl;
    private Double rating;
    private String content;
    private LocalDateTime createdAt;
    private List<RecommendationDto> recommendations;

    // 추천앨범 내부 DTO
    @Getter
    @Builder
    public static class RecommendationDto {
        private String spotifyAlbumId;
        private String albumName;
        private String artistName;
        private String artworkUrl;
    }

    public static FeedResDto from(AlbumReview review) {
        return FeedResDto.builder()
                .reviewId(review.getReviewId())
                .username(review.getUser().getUsername())
                .nickname(review.getUser().getNickname())
                .spotifyAlbumId(review.getAlbum().getSpotifyAlbumId())
                .albumName(review.getAlbum().getAlbumName())
                .artistName(review.getAlbum().getArtistName())
                .artworkUrl(review.getAlbum().getArtworkUrl())
                .rating(review.getRating())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .recommendations(review.getRecommendations().stream()
                        .map(rec -> RecommendationDto.builder()
                                .spotifyAlbumId(rec.getAlbum().getSpotifyAlbumId())
                                .albumName(rec.getAlbum().getAlbumName())
                                .artistName(rec.getAlbum().getArtistName())
                                .artworkUrl(rec.getAlbum().getArtworkUrl())
                                .build())
                        .toList())
                .build();
    }
}
