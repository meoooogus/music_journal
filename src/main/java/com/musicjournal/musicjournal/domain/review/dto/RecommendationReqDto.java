package com.musicjournal.musicjournal.domain.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class RecommendationReqDto {

    private String spotifyAlbumId;
    private String albumName;
    private String artistName;
    private String artistId;
    private String artworkUrl;
    private String releaseDate;
    private Integer totalTracks;
}
