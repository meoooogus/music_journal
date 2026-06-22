package com.musicjournal.musicjournal.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter { // 요청당 한번만 실행 보장

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtTokenProvider jwtTokenProvider;


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = resolveToken(request); // 헤더에서 토큰 추출

        // 토큰 검증 + 인증 객체 생성을 한 번의 파싱으로 처리
        if (StringUtils.hasText(token)) {
            jwtTokenProvider.resolveAuthentication(token)
                    .ifPresentOrElse(
                            auth -> {
                                SecurityContextHolder.getContext().setAuthentication(auth);
                                log.debug("인증 성공 - email: {}", auth.getName());
                            },
                            () -> log.warn("토큰 검증 실패 - uri: {}", request.getRequestURI())
                    );
        }

        filterChain.doFilter(request, response); // 다음 필터로 전달
    }

    // "Bearer <token>" 형식에서 토큰 문자열만 추출
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        return null;
    }
}
