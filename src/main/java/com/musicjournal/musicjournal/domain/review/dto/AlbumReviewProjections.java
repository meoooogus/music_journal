package com.musicjournal.musicjournal.domain.review.dto;

public class AlbumReviewProjections {

    // 집계 쿼리 결과는 엔티티가 없음(DB가 계산한 값). 안전하게 받기 위해 Projection 사용

    public interface MostReviewedProjection {
        String getSpotifyAlbumId();
        String getAlbumName();
        String getArtistName();
        String getArtworkUrl();
        Long getReviewCount();
    }

    public interface HighestRatedProjection {
        String getSpotifyAlbumId();
        String getAlbumName();
        String getArtistName();
        String getArtworkUrl();
        Double getAvgRating();
    }
}