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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;
}
