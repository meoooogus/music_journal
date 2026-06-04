package com.musicjournal.musicjournal.domain.profile.dto;

import com.musicjournal.musicjournal.domain.review.entity.AlbumReview;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ProfileReviewResDto {

    private Long reviewId;
    private String spotifyAlbumId;
    private String albumName;
    private String artistName;
    private String artworkUrl;
    private Double rating;
    private String content;
    private LocalDateTime createdAt;

    public static ProfileReviewResDto from(AlbumReview review) {
        return ProfileReviewResDto.builder()
                .reviewId(review.getReviewId())
                .spotifyAlbumId(review.getAlbum().getSpotifyAlbumId())
                .albumName(review.getAlbum().getAlbumName())
                .artistName(review.getAlbum().getArtistName())
                .artworkUrl(review.getAlbum().getArtworkUrl())
                .rating(review.getRating())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
