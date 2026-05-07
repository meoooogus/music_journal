package com.musicjournal.musicjournal.domain.album.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AlbumResDto {
    private String albumName;
    private String spotifyAlbumId;
    private String artistName;
    private String artistId;
    private String artworkUrl;
    private String releaseDate;
    private Integer totalTracks;
}
