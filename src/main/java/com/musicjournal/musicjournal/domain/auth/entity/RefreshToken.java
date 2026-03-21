package com.musicjournal.musicjournal.domain.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "refresh_tokens") // DB 네이밍 컨벤션에 맞추기위해 (복수형)
public class RefreshToken {

    @Id
    @Column(name = "user_email") // 유저 식별을 위한 이메일, User에서 natural key로 설정
    private String email;

    @Column(nullable = false)
    private String token; // 실제 토큰 문자열

    @Column(nullable = false)
    private LocalDateTime expiresAt; // 토큰 만료 기준선

    public RefreshToken updateToken(String newToken, LocalDateTime newExpiresAt) {
        this.token = newToken;
        this.expiresAt = newExpiresAt;
        return this;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }
}
