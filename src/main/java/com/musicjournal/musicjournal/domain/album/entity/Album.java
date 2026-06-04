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

}