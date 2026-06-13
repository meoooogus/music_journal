package com.musicjournal.musicjournal.domain.track.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackReqDto {

    @NotBlank private String spotifyId;
    @NotBlank private String title;
    @NotBlank private String artistName;
    @NotBlank private String artistId;
    @NotBlank private String albumName;
    @NotBlank private String albumId;
    private String artworkUrl;  // nullable
    @NotNull private Integer durationMs;
}
