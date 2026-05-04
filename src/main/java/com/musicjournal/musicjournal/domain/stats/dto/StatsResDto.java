package com.musicjournal.musicjournal.domain.stats.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class StatsResDto {

    private long totalCount; // 전체 기록 수
    private long monthlyCount; // 이번 달 기록 수

    private List<ArtistStatDto> topArtist;
    private List<ArtistStatDto> topTracks;
    private List<ArtistStatDto> topAlbums;


    @Getter
    @Builder
    public static class ArtistStatDto {
        private String artistName;
        private String artistId;
        private long count;
    }

    @Getter
    @Builder
    public static class TrackStatDto {
        private String title;
        private String spotifyId;
        private String artworkUrl;
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
}
