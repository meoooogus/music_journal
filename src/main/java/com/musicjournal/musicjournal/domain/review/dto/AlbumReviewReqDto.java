package com.musicjournal.musicjournal.domain.review.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class AlbumReviewReqDto {

    @NotNull
    @DecimalMin("0.1")
    @DecimalMax("10.0")
    private Double rating;

    // 평론 선택
    private String content;

    // 추천 앨범: 최대 3개
    @Valid
    @Size(max = 3)
    private List<RecommendationReqDto> recommendations = new ArrayList<>();
}
