package com.musicjournal.musicjournal.domain.album.service;

import com.musicjournal.musicjournal.domain.album.dto.AlbumReqDto;
import com.musicjournal.musicjournal.domain.album.dto.TrendingResDto;
import com.musicjournal.musicjournal.domain.album.entity.Album;
import com.musicjournal.musicjournal.domain.album.entity.AlbumRepository;
import com.musicjournal.musicjournal.domain.review.entity.AlbumReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final AlbumReviewRepository albumReviewRepository;

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

    @Transactional(readOnly = true)
    public TrendingResDto getTrending() {
        LocalDate now = LocalDate.now();
        Pageable top4 = PageRequest.of(0, 4);

        // 이번 달 리뷰 수 TOP 4
        List<TrendingResDto.MostReviewedDto> mostReviewed = albumReviewRepository
                .findMostReviewed(now.getYear(), now.getMonthValue(), top4).stream()
                .map(p -> TrendingResDto.MostReviewedDto.builder()
                        .spotifyAlbumId(p.getSpotifyAlbumId())
                        .albumName(p.getAlbumName())
                        .artistName(p.getArtistName())
                        .artworkUrl(p.getArtworkUrl())
                        .reviewCount(p.getReviewCount())
                        .build())
                .toList();

        // 이번 달 평균 평점 TOP 4
        List<TrendingResDto.HighestRatedDto> highestRated = albumReviewRepository
                .findHighestRated(now.getYear(), now.getMonthValue(), top4).stream()
                .map(p -> TrendingResDto.HighestRatedDto.builder()
                        .spotifyAlbumId(p.getSpotifyAlbumId())
                        .albumName(p.getAlbumName())
                        .artistName(p.getArtistName())
                        .artworkUrl(p.getArtworkUrl())
                        .avgRating(p.getAvgRating())
                        .build())
                .toList();

        return TrendingResDto.builder()
                .mostReviewed(mostReviewed)
                .highestRated(highestRated)
                .build();
    }
}
