package com.musicjournal.musicjournal.domain.album.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class AlbumReqDto {

    @NotBlank
    private String albumName;

    @NotBlank
    private String artistName;

    @NotBlank
    private String artistId;

    private String artworkUrl;
    private String releaseDate;
    private Integer totalTracks;
}
