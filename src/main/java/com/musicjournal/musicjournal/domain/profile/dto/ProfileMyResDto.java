package com.musicjournal.musicjournal.domain.profile.dto;

import com.musicjournal.musicjournal.domain.stats.dto.StatsResDto;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ProfileMyResDto {

    private String username;
    private long followerCount;
    private long followingCount;
    private int reviewCount;
    private List<ProfileReviewResDto> reviews;
    private StatsResDto stat;
}
