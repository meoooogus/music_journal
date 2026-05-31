package com.musicjournal.musicjournal.domain.review.dto;
import com.musicjournal.musicjournal.domain.review.entity.AlbumReview;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class AlbumReviewResDto {

    private Long reviewId;
    private String username;
    private Double rating;
    private String content;
    private LocalDateTime createdAt;
    private List<RecommendationResDto> recommendations;

    public static AlbumReviewResDto from(AlbumReview review) {

        return AlbumReviewResDto.builder()
                .reviewId(review.getReviewId())
                .username(review.getUser().getUsername())
                .rating(review.getRating())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .recommendations(review.getRecommendations().stream()
                        .map(RecommendationResDto::from)
                        .toList())
                .build();
    }
}
