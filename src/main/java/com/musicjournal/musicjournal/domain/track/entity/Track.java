package com.musicjournal.musicjournal.domain.track.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Table(name = "tracks")
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trackId;

    // spotify 고유 id - 중복 저장 방지
    @Column(nullable = false, unique = true)
    private String spotifyId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artistName;

    @Column(nullable = false)
    private String artistId;

    // 아트워크 없는 경우 고려
    private String artworkUrl;

    @Column(nullable = false)
    private String albumName;

    @Column(nullable = false)
    private String albumId;

    @Column(nullable = false)
    private Integer durationMs;

}
