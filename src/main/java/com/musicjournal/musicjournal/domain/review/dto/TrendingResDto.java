package com.musicjournal.musicjournal.domain.review.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class TrendingResDto {

    private List<MostReviewedDto> mostReviewed;
    private List<HighestRatedDto> highestRated;

    @Getter
    @Builder
    public static class MostReviewedDto {
        private String spotifyAlbumId;
        private String albumName;
        private String artistName;
        private String artworkUrl;
        private Long reviewCount;
    }

    @Getter
    @Builder
    public static class HighestRatedDto {
        private String spotifyAlbumId;
        private String albumName;
        private String artistName;
        private String artworkUrl;
        private Double avgRating;
    }
}
