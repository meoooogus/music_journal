package com.musicjournal.musicjournal.domain.track.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackReqDto {

    private String spotifyId;
    private String title;
    private String artistName;
    private String artistId;
    private String albumName;
    private String albumId;
    private String artworkUrl;  // nullable
    private Integer durationMs;
}
