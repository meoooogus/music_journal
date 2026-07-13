package com.musicjournal.musicjournal.domain.stats.service;

import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.auth.entity.UserRepository;
import com.musicjournal.musicjournal.domain.record.entity.RecordRepository;
import com.musicjournal.musicjournal.domain.review.entity.AlbumReviewUserRepository;
import com.musicjournal.musicjournal.domain.stats.dto.StatsResDto;
import com.musicjournal.musicjournal.exception.CustomException;
import com.musicjournal.musicjournal.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatsService {

    private final RecordRepository recordRepository;
    private final UserRepository userRepository;
    private final AlbumReviewUserRepository albumReviewUserRepository;

    private static final int TOP_N = 3;

    public StatsResDto getStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        LocalDate now = LocalDate.now();

        long totalCount = recordRepository.countByUser(user);

        long monthlyCount = recordRepository.countByUserAndYearMonth(user, now.getYear(), now.getMonthValue());

        List<StatsResDto.ArtistStatDto> topArtists = recordRepository
                .findTopArtistsByUser(user, TOP_N).stream()
                .map(row -> StatsResDto.ArtistStatDto.builder()
                        .artistName(row.getArtistName())
                        .artistId(row.getArtistId())
                        .count(row.getCount())
                        .build()
                ).toList();

        List<StatsResDto.AlbumStatDto> topAlbums = recordRepository
                .findTopAlbumByUser(user, TOP_N).stream()
                .map(row -> StatsResDto.AlbumStatDto.builder()
                        .albumId(row.getAlbumId())
                        .albumName(row.getAlbumName())
                        .artworkUrl(row.getArtworkUrl())
                        .count(row.getCount())
                        .build()
                ).toList();

        List<StatsResDto.TopRatedReviewDto> topRatedReviews = albumReviewUserRepository
                .findTopRatedByUser(user, PageRequest.of(0, TOP_N)).stream()
                .map(review -> StatsResDto.TopRatedReviewDto.builder()
                        .spotifyAlbumId(review.getAlbum().getSpotifyAlbumId())
                        .albumName(review.getAlbum().getAlbumName())
                        .artistName(review.getAlbum().getArtistName())
                        .artworkUrl(review.getAlbum().getArtworkUrl())
                        .rating(review.getRating())
                        .build()
                ).toList();

        return StatsResDto.builder()
                .totalCount(totalCount)
                .monthlyCount(monthlyCount)
                .topArtists(topArtists)
                .topAlbums(topAlbums)
                .topRatedReviews(topRatedReviews)
                .build();
    }
}
