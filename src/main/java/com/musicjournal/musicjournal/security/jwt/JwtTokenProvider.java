package com.musicjournal.musicjournal.security.jwt;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.auth.service.CustomUserDetailsService;
import jakarta.annotation.PostConstruct;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.DecodingException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;
    private final CustomUserDetailsService customUserDetailsService;
    private SecretKey signingKey; // 캐싱된 서명 키

    // 애플리케이션 시작 시 한 번만 Base64 디코딩 → HMAC-SHA 키 생성
    @PostConstruct
    private void init() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecretKey());
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
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
                .signWith(signingKey)  // 서명 - 위변조 방지
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
        } catch (UnsupportedJwtException | IllegalArgumentException | DecodingException e) {
            log.warn("지원하지 않는 형식 또는 빈 토큰: {}", e.getMessage());
        }
        return false;
    }

    // JwtFilter 전용 — 검증 + 인증 객체 생성을 한 번의 파싱으로 처리
    public Optional<Authentication> resolveAuthentication(String token) {
        try {
            String email = parseClaims(token).getSubject();
            CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsername(email);
            return Optional.of(new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()));
        } catch (SecurityException | MalformedJwtException e) {
            log.warn("서명 불일치 또는 잘못된 토큰 형식: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.warn("만료된 토큰 - subject: {}", e.getClaims().getSubject());
        } catch (UnsupportedJwtException | IllegalArgumentException | DecodingException e) {
            log.warn("지원하지 않는 형식 또는 빈 토큰: {}", e.getMessage());
        }
        return Optional.empty();
    }

    // 토큰에서 이메일(subject) 추출 — refresh 재발급 시 AuthService에서 사용
    public String getEmail(String token) {
        return parseClaims(token).getSubject();
    }

    // 서명 검증 후 Claims 파싱
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()    // 이후 실제 동작
                .parseSignedClaims(token)
                .getPayload();
    }
}