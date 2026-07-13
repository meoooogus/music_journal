package com.musicjournal.musicjournal.domain.album.service;

import com.musicjournal.musicjournal.domain.album.dto.AlbumDetailResDto;
import com.musicjournal.musicjournal.domain.album.dto.AlbumReqDto;
import com.musicjournal.musicjournal.domain.album.entity.Album;
import com.musicjournal.musicjournal.domain.album.entity.AlbumRepository;
import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.exception.CustomException;
import com.musicjournal.musicjournal.exception.ErrorCode;
import com.musicjournal.musicjournal.spotify.SpotifyApiService;
import com.musicjournal.musicjournal.spotify.dto.SpotifyAlbumResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final AlbumDetailQueryService albumDetailQueryService;
    private final SpotifyApiService spotifyApiService;

    @Transactional
    public Album upsert(String spotifyAlbumId, AlbumReqDto dto) {
        return albumRepository.findBySpotifyAlbumId(spotifyAlbumId)
                .map(album -> {
                    // 기존 앨범 — Spotify 최신 정보로 동기화 (dirty checking으로 자동 UPDATE)
                    album.update(dto.getAlbumName(), dto.getArtistId(), dto.getArtistName(),
                            dto.getArtworkUrl(), dto.getReleaseDate(), dto.getTotalTracks());
                    return album;
                })
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

    public Album getBySpotifyAlbumId(String spotifyAlbumId) {
        return albumRepository.findBySpotifyAlbumId(spotifyAlbumId)
                .orElseThrow(() -> new CustomException(ErrorCode.ALBUM_NOT_FOUND));
    }

    // 외부 API 호출과 DB 조회를 트랜잭션 분리 — 커넥션 점유 최소화
    public AlbumDetailResDto getAlbumDetail(String spotifyAlbumId, User user) {
        // 1. Spotify API — 트랜잭션 밖 (DB 커넥션 미사용)
        SpotifyAlbumResDto spotify = spotifyApiService.getAlbumDetail(spotifyAlbumId);

        // 2. DB 리뷰 조회 — @Transactional(readOnly = true)로 일관된 스냅샷 보장
        //    user: 최신 N개 preview에서 내 리뷰가 밀려도 포함 보장하기 위해 전달
        AlbumDetailQueryService.ReviewSummary summary =
                albumDetailQueryService.getReviewSummary(spotifyAlbumId, user);

        return AlbumDetailResDto.builder()
                .spotifyAlbumId(spotify.getSpotifyAlbumId())
                .albumName(spotify.getAlbumName())
                .artistName(spotify.getArtistName())
                .artworkUrl(spotify.getArtworkUrl())
                .releaseDate(spotify.getReleaseDate())
                .totalTracks(spotify.getTotalTracks())
                .spotifyUrl(spotify.getSpotifyUrl())
                .avgRating(summary.getAvgRating())
                .reviewCount(summary.getReviewCount())
                .reviews(summary.getReviews())
                .tracks(spotify.getTracks())
                .build();
    }
}
