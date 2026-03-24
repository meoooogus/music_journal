package com.musicjournal.musicjournal.domain.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RefreshReqDto {
    private String refreshToken;
}
