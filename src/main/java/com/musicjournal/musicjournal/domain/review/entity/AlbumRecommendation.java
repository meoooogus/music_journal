package com.musicjournal.musicjournal.domain.review.entity;

import com.musicjournal.musicjournal.domain.album.entity.Album;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "album_recommendations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class AlbumRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recommendationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private AlbumReview review;

    // 추천앨범은 항상 album 정보와 함께 사용되므로 EAGER
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;
}
