package com.musicjournal.musicjournal.domain.review.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecommendationResDto {

    private String spotifyAlbumId;
    private String albumName;
    private String artistName;
    private String artworkUrl;
}
