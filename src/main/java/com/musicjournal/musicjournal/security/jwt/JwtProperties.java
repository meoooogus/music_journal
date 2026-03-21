package com.musicjournal.musicjournal.security.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

// application.yml의 jwt.* 값을 Java 객체로 바인딩
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    // jwt.secret-key → secretKey (kebab-case 자동 변환)
    private String secretKey;

    // jwt.expiration.* 중첩 구조 바인딩
    private Expiration expiration;

    // jwt.issuer → 토큰 발급자 식별자
    private String issuer;

    @Getter
    @Setter
    public static class Expiration {
        private long accessToken;
    } // 내부 클래스를 만들어 yml 계층 구조를 표현
}
