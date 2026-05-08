package com.musicjournal.musicjournal.domain.review.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RecommendationReqDto {

    private String spotifyAlbumId;
    private String albumName;
    private String artistName;
    private String artistId;
    private String artworkUrl;
}
