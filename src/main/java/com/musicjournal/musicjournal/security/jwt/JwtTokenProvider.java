package com.musicjournal.musicjournal.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

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
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtProperties.getExpiration().getAccessToken());

        return Jwts.builder()
                .subject(email)
                .issuer(jwtProperties.getIssuer())
                .issuedAt(now)
                .expiration(expiry)         // 만료 시작
                .signWith(getSigningKey())  // 서명 - 위변조 방지
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException exception) {
            // 서명 불일치 또는 잘못된 토큰 형식
        } catch (ExpiredJwtException e) {
            // 만료된 토큰 -> 클라이언트는 재발급 요청
        } catch (UnsupportedJwtException | IllegalArgumentException e) {
            // 지원하지 않는 형식 또는 빈 값
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
