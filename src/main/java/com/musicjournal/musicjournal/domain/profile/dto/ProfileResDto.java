package com.musicjournal.musicjournal.domain.profile.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ProfileResDto {

    private String username;
    private String nickname;
    private long followerCount;
    private long followingCount;
    private int reviewCount;
    private List<ProfileReviewResDto> reviews;
}
