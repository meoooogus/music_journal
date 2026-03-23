package com.musicjournal.musicjournal.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder // 직렬화 (서버 -> 클라이언트)
public class LoginResDto {

    private String accessToken;
    private String refreshToken;

}
