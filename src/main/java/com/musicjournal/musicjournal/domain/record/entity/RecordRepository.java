package com.musicjournal.musicjournal.domain.record.entity;

import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.stats.dto.StatsProjections;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

public interface RecordRepository extends JpaRepository<Record, Long> {

    // 특정 유저의 특정 날짜 기록 목록 조회
    List<Record> findByUserAndRecordedDate(User user, LocalDate recordedDate);

    // 전체 목록 조회
    List<Record> findByUser(User user);

    // 전체 기록 수
    long countByUser(User user);

    // 이번 달 기록 수
    @Query("SELECT COUNT(r) FROM Record r WHERE r.user = :user AND YEAR(r.recordedDate) = :year AND MONTH(r.recordedDate) = :month")
    long countByUserAndYearMonth(@Param("user") User user, @Param("year") int year, @Param("month") int month);

    // 아티스트별 기록 수
    @Query("SELECT r.track.artistName AS artistName, r.track.artistId AS artistId, COUNT(r) AS count FROM Record r WHERE r.user = :user GROUP BY r.track.artistName, r.track.artistId ORDER BY COUNT(r) DESC LIMIT :limit")
    List<StatsProjections.ArtistStatProjection> findTopArtistsByUser(@Param("user") User user, @Param("limit") int limit);

    // 앨범별 기록 수
    @Query("SELECT r.track.albumId AS albumId, r.track.albumName AS albumName, r.track.artworkUrl AS artworkUrl, COUNT(r) AS count FROM Record r WHERE r.user = :user GROUP BY r.track.albumId, r.track.albumName, r.track.artworkUrl ORDER BY COUNT(r) DESC LIMIT :limit")
    List<StatsProjections.AlbumStatProjection> findTopAlbumByUser(@Param("user") User user, @Param("limit") int limit);

}
