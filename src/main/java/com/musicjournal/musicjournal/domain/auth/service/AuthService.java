package com.musicjournal.musicjournal.domain.auth.service;

import com.musicjournal.musicjournal.domain.auth.dto.LoginReqDto;
import com.musicjournal.musicjournal.domain.auth.dto.LoginResDto;
import com.musicjournal.musicjournal.domain.auth.dto.SignupReqDto;
import com.musicjournal.musicjournal.domain.auth.entity.RefreshToken;
import com.musicjournal.musicjournal.domain.auth.entity.RefreshTokenRepository;
import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.auth.entity.UserRepository;
import com.musicjournal.musicjournal.security.jwt.JwtProperties;
import com.musicjournal.musicjournal.security.jwt.JwtTokenProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;

    @Transactional
    public void signUp(SignupReqDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        String hashedPassword = passwordEncoder.encode(dto.getPassword());

        User user = User.builder()
                .email(dto.getEmail())
                .passwordHash(hashedPassword)
                .username(dto.getUsername())
                .build();

        userRepository.save(user);
    }

    @Transactional
    public LoginResDto login(LoginReqDto dto) {
        // 1. email로 user 조회
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 이메일입니다."));

        // 2. password 검증
        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 3. access token, refresh token 생성
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds((
                jwtProperties.getExpiration().getRefreshToken() / 1000
        ));

        // 4. refresh token 있으면 갱신, 없으면 신규 저장
        refreshTokenRepository.findByEmail(user.getEmail())
                .ifPresentOrElse(
                        rt -> rt.updateToken(refreshToken, expiresAt),
                        () -> refreshTokenRepository.save(
                                RefreshToken.builder()
                                        .email(user.getEmail())
                                        .token(refreshToken)
                                        .expiresAt(expiresAt)
                                        .build()
                        )
                );

        return LoginResDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
