package com.musicjournal.musicjournal.domain.album.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "albums")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long albumId;

    @Column(nullable = false)
    private String albumName;

    @Column(nullable = false)
    private String artistId;

    @Column(nullable = false)
    private String artistName;

    private String artworkUrl;

    @Column(nullable = false)
    private String releaseDate;

    @Column(unique = true, nullable = false)
    private String spotifyAlbumId;

    @Column(nullable = false)
    private Integer totalTracks;

    // Spotify 측 정보 동기화 — 변경 여부는 Hibernate dirty checking이 판단
    public void update(String albumName, String artistId, String artistName,
                       String artworkUrl, String releaseDate, Integer totalTracks) {
        this.albumName = albumName;
        this.artistId = artistId;
        this.artistName = artistName;
        this.artworkUrl = artworkUrl;
        this.releaseDate = releaseDate;
        this.totalTracks = totalTracks;
    }

}