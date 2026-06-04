package com.musicjournal.musicjournal.spotify.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AlbumTrackResDto {
    private String spotifyId;
    private Integer discNumber;
    private Integer trackNumber;
    private String title;
    private String artistName;
    private Integer durationMs;
}
