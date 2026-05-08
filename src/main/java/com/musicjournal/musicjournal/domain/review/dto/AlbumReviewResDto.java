package com.musicjournal.musicjournal.domain.review.dto;

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
}
