package com.musicjournal.musicjournal.domain.follow.dto;

import com.musicjournal.musicjournal.domain.auth.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FollowUserResDto {

    private String username;
    private String nickname;

    public static FollowUserResDto from(User user) {
        return FollowUserResDto.builder()
                .username(user.getUsername())
                .nickname(user.getNickname())
                .build();
    }
}
