package com.musicjournal.musicjournal.domain.review.entity;

import com.musicjournal.musicjournal.domain.album.entity.Album;
import com.musicjournal.musicjournal.domain.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "album_reviews",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "album_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EntityListeners(AuditingEntityListener.class)
public class AlbumReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    // 평점: 0.1 ~ 10.0
    @Column(nullable = false)
    private Double rating;

    // 평론: 선택 입력
    private String content;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // 리뷰 삭제 시 추천 앨범도 함께 삭제, 리스트에서 제거 시 DB에서도 삭제
    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default    // null이 아닌 빈 리스트로 초기화
    private List<AlbumRecommendation> recommendations = new ArrayList<>();

    // 리뷰 수정 시 평점·평론 갱신 (추천 앨범은 AlbumRecommendation에서 별도 처리)
    public void update(Double rating, String content) {
        this.rating = rating;
        this.content = content;
    }
}
