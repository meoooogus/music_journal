package com.musicjournal.musicjournal.domain.album.service;

import com.musicjournal.musicjournal.domain.album.dto.AlbumReqDto;
import com.musicjournal.musicjournal.domain.album.entity.Album;
import com.musicjournal.musicjournal.domain.album.entity.AlbumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AlbumService {
    private final AlbumRepository albumRepository;

    @Transactional
    public Album upsert(String spotifyAlbumId, AlbumReqDto dto) {
        // spotifyAlbumId로 DB 조회 후 없으면 저장
        return albumRepository.findBySpotifyAlbumId(spotifyAlbumId)
                .orElseGet(() -> albumRepository.save(
                        Album.builder()
                                .albumName(dto.getAlbumName())
                                .artistId(dto.getArtistId())
                                .artistName(dto.getArtistName())
                                .artworkUrl(dto.getArtworkUrl())
                                .releaseDate(dto.getReleaseDate())
                                .spotifyAlbumId(spotifyAlbumId)
                                .totalTracks(dto.getTotalTracks())
                                .build()
                ));
    }
}
