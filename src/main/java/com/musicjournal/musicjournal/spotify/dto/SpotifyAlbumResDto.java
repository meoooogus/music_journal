package com.musicjournal.musicjournal.spotify.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SpotifyAlbumResDto {
    private String spotifyAlbumId;
    private String albumName;
    private String artistName;
    private String artworkUrl;
    private String releaseDate;
    private Integer totalTracks;
    private String spotifyUrl;           // external_urls.spotify
    private List<AlbumTrackResDto> tracks;
}
