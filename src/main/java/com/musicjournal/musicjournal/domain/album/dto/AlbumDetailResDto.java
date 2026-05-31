package com.musicjournal.musicjournal.domain.album.dto;

import com.musicjournal.musicjournal.domain.review.dto.AlbumReviewResDto;
import com.musicjournal.musicjournal.spotify.dto.AlbumTrackResDto;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AlbumDetailResDto {
    // Spotify 앨범 정보
    private String spotifyAlbumId;
    private String albumName;
    private String artistName;
    private String artworkUrl;
    private String releaseDate;
    private Integer totalTracks;
    private String spotifyUrl;

    // 리뷰 집계 (DB에 앨범 없으면 null)
    private Double avgRating;
    private Long reviewCount;

    // 리뷰 목록
    private List<AlbumReviewResDto> reviews;

    // 트랙 목록
    private List<AlbumTrackResDto> tracks;
}
