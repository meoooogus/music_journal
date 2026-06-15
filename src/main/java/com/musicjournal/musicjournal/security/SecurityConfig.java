package com.musicjournal.musicjournal.security;

import tools.jackson.databind.ObjectMapper;
import com.musicjournal.musicjournal.exception.ErrorResDto;
import com.musicjournal.musicjournal.security.jwt.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final ObjectMapper objectMapper;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // JWT 기반 stateless -> CSRF 불필요

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 서버 세션 생성 금지

                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())) // H2 console iframe 허용

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/signup", "/auth/login", "/auth/refresh", "/auth/check-username", "/auth/check-email").permitAll() // 인증 없이 접근 가능
                        .requestMatchers("/h2-console/**").permitAll()
                        // 프론트엔드 정적 리소스 — 인증 없이 접근 허용
                        .requestMatchers("/", "/index.html", "/assets/**", "/*.png", "/*.jpg", "/*.ico", "/*.svg", "/manifest.json").permitAll()
                        // SPA fallback — 확장자 없는 단일 경로를 허용 (SpaController가 index.html로 forward)
                        .requestMatchers("/{path:[^\\.]*}").permitAll()
                        .anyRequest().authenticated() // 그 외 모든 요청은 인증 필요
                )
                .exceptionHandling(ex -> ex
                        // 인증 실패 (토큰 없음/만료) → 401
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.setCharacterEncoding("UTF-8");
                            objectMapper.writeValue(response.getOutputStream(),
                                    new ErrorResDto("UNAUTHORIZED", "인증이 필요합니다."));
                        })
                        // 인가 실패 (권한 부족) → 403
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.setCharacterEncoding("UTF-8");
                            objectMapper.writeValue(response.getOutputStream(),
                                    new ErrorResDto("ACCESS_DENIED", "접근 권한이 없습니다."));
                        })
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // JWT 검증을 Security 필터 앞에 삽입

        return http.build();
    }
}
