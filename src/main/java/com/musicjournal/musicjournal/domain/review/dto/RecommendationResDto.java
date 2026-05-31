package com.musicjournal.musicjournal.domain.review.dto;

import com.musicjournal.musicjournal.domain.album.entity.Album;
import com.musicjournal.musicjournal.domain.review.entity.AlbumRecommendation;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecommendationResDto {

    private String spotifyAlbumId;
    private String albumName;
    private String artistName;
    private String artworkUrl;

    public static RecommendationResDto from(AlbumRecommendation albumRecommendation) {
        Album album = albumRecommendation.getAlbum();

        return RecommendationResDto.builder()
                .spotifyAlbumId(album.getSpotifyAlbumId())
                .albumName(album.getAlbumName())
                .artistName(album.getArtistName())
                .artworkUrl(album.getArtworkUrl())
                .build();
    }
}
