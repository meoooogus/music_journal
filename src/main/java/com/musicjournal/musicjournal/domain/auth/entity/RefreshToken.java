package com.musicjournal.musicjournal.domain.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)  // JPA 전용, 외부 직접 생성 차단
@AllArgsConstructor(access = AccessLevel.PRIVATE)   // Builder 전용, 외부 호출 불가
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
    } // DB 저장 시간 기준으로 서버에서 직접 검증
}
