package com.musicjournal.musicjournal.domain.stats.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class StatsResDto {

    private long totalCount; // 전체 기록 수
    private long monthlyCount; // 이번 달 기록 수

    private List<ArtistStatDto> topArtists;
    private List<AlbumStatDto> topAlbums;
    private List<TopRatedReviewDto> topRatedReviews; // 평점 높은 순 내 평론

    @Getter
    @Builder
    public static class ArtistStatDto {
        private String artistName;
        private String artistId;
        private long count;
    }

    @Getter
    @Builder
    public static class AlbumStatDto {
        private String albumName;
        private String albumId;
        private String artworkUrl;
        private long count;
    }

    @Getter
    @Builder
    public static class TopRatedReviewDto {
        private String spotifyAlbumId;
        private String albumName;
        private String artistName;
        private String artworkUrl;
        private Double rating;
    }
}
