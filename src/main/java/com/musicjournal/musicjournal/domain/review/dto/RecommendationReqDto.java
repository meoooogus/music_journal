package com.musicjournal.musicjournal.domain.review.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class RecommendationReqDto {

    @NotBlank private String spotifyAlbumId;
    @NotBlank private String albumName;
    @NotBlank private String artistName;
    @NotBlank private String artistId;
    private String artworkUrl;
    private String releaseDate;
    private Integer totalTracks;
}
