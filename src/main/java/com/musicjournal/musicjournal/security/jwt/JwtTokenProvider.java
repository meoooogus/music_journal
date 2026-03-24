package com.musicjournal.musicjournal.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    // secret-key를 Base64 디코딩 후 HMAC-SHA256 서명 키로 변환
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecretKey());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Access Token 생성
    public String generateAccessToken(String email) {
        return generateToken(email, jwtProperties.getExpiration().getAccessToken());
    }

    // Refresh Token 생성
    public String generateRefreshToken(String email) {
        return generateToken(email, jwtProperties.getExpiration().getRefreshToken());
    }

    // 토큰 생성 공통 로직
    private String generateToken(String email, long expirationMs) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(email)
                .issuer(jwtProperties.getIssuer())
                .issuedAt(now)
                .expiration(expiry)         // 만료 시간
                .signWith(getSigningKey())  // 서명 - 위변조 방지
                .compact();
    }



    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.warn("서명 불일치 또는 잘못된 토큰 형식: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.warn("만료된 토큰 - subject: {}", e.getClaims().getSubject());
        } catch (UnsupportedJwtException | IllegalArgumentException e) {
            log.warn("지원하지 않는 형식 또는 빈 토큰: {}", e.getMessage());
        }
        return false;
    }

    // jwt토큰을 이용해 Security 전용 인증 객체 생성
    public Authentication getAuthentication(String token) {
        String email = getEmail(token);

         return new UsernamePasswordAuthenticationToken(
                email,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    private String getEmail(String token) {
        return parseClaims(token).getSubject();
    }

    // 서명 검증 후 Claims 파싱
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()    // 이후 실제 동작
                .parseSignedClaims(token)
                .getPayload();
    }
}