package com.musicjournal.musicjournal.domain.track.service;

import com.musicjournal.musicjournal.domain.track.dto.TrackReqDto;
import com.musicjournal.musicjournal.domain.track.entity.Track;
import com.musicjournal.musicjournal.domain.track.entity.TrackRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrackService {
    private final TrackRepository trackRepository;

    @Transactional
    public Track upsert(TrackReqDto dto) {
        return trackRepository.findBySpotifyId(dto.getSpotifyId())
                .map(track -> {
                    // 기존 트랙 — Spotify 최신 정보로 동기화 (dirty checking으로 자동 UPDATE)
                    track.update(dto.getTitle(), dto.getArtistName(), dto.getArtistId(),
                            dto.getArtworkUrl(), dto.getAlbumName(), dto.getAlbumId(),
                            dto.getDurationMs());
                    return track;
                })
                .orElseGet(() -> trackRepository.save(
                        Track.builder()
                                .spotifyId(dto.getSpotifyId())
                                .title(dto.getTitle())
                                .artistName(dto.getArtistName())
                                .artistId(dto.getArtistId())
                                .artworkUrl(dto.getArtworkUrl())
                                .albumName(dto.getAlbumName())
                                .albumId(dto.getAlbumId())
                                .durationMs(dto.getDurationMs())
                                .build()
                ));
    }
}
