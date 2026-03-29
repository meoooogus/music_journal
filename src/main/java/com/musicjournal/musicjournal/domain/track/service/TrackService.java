package com.musicjournal.musicjournal.domain.track.service;

import com.musicjournal.musicjournal.domain.track.dto.TrackReqDto;
import com.musicjournal.musicjournal.domain.track.dto.TrackResDto;
import com.musicjournal.musicjournal.domain.track.entity.Track;
import com.musicjournal.musicjournal.domain.track.entity.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrackService {
    private final TrackRepository trackRepository;

    public TrackResDto upsert(TrackReqDto dto) {
        Track track = trackRepository.findBySpotifyId(dto.getSpotifyId())
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

        return TrackResDto.from(track);
    }
}
