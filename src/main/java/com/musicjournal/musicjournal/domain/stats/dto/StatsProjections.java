package com.musicjournal.musicjournal.domain.stats.dto;

public class StatsProjections {

    public interface ArtistStatProjection {
        String getArtistName();
        String getArtistId();
        Long getCount();
    }

    public interface AlbumStatProjection {
        String getAlbumId();
        String getAlbumName();
        String getArtworkUrl();
        Long getCount();
    }
}
