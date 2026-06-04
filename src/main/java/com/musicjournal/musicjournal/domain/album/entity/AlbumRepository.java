package com.musicjournal.musicjournal.domain.album.entity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, Long> {

    Optional<Album> findBySpotifyAlbumId(String spotifyAlbumId);
}
