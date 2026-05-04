package com.musicjournal.musicjournal.domain.stats.service;

import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.auth.entity.UserRepository;
import com.musicjournal.musicjournal.domain.record.entity.RecordRepository;
import com.musicjournal.musicjournal.domain.stats.dto.StatsResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    private static final int TOP_N = 3;

    public StatsResDto getStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("유저를 찾을 수 없습니다"));

        LocalDate now = LocalDate.now();

        long totalCount = recordRepository.countByUser(user);

        long monthlyCount = recordRepository.countByUserAndYearMonth(user, now.getYear(), now.getMonthValue());

        List<StatsResDto.ArtistStatDto> topArtists = recordRepository
                .findTopArtistsByUser(user, TOP_N).stream()
                .map(row -> StatsResDto.ArtistStatDto.builder()
                        .artistName((String) row[0])
                        .artistId((String) row[1])
                        .count((Long) row[2])
                        .build()
                ).toList();

        List<StatsResDto.AlbumStatDto> topAlbums = recordRepository
                .findTopAlbumByUser(user, TOP_N).stream()
                .map(row -> StatsResDto.AlbumStatDto.builder()
                        .albumId((String) row[0])
                        .albumName((String) row[1])
                        .artworkUrl((String) row[2])
                        .count((Long) row[3])
                        .build()
                ).toList();

        return StatsResDto.builder()
                .totalCount(totalCount)
                .monthlyCount(monthlyCount)
                .topArtists(topArtists)
                .topAlbums(topAlbums)
                .build();
    }
}
