package com.musicjournal.musicjournal.domain.track.dto;

import com.musicjournal.musicjournal.domain.track.entity.Track;
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

    public static TrackResDto from(Track track) {

        return TrackResDto.builder()
                .spotifyId(track.getSpotifyId())
                .title(track.getTitle())
                .artistName(track.getArtistName())
                .artistId(track.getArtistId())
                .albumName(track.getAlbumName())
                .albumId(track.getAlbumId())
                .artworkUrl(track.getArtworkUrl())
                .durationMs(track.getDurationMs())
                .build();
    }
}
