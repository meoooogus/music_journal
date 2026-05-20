package com.musicjournal.musicjournal.domain.profile.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ProfileResDto {

    private String username;
    private int reviewCount;
    private List<ProfileReviewResDto> reviews;
}
