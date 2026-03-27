package com.musicjournal.musicjournal.domain.track.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TrackResDto {

    private String spotifyId;
    private String title;
    private String artistName;
    private String artistId;
    private String albumName;
    private String albumId;
    private String artworkUrl;
    private Integer durationMs;
}
