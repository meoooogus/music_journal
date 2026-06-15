package com.musicjournal.musicjournal.domain.auth.service;

import com.musicjournal.musicjournal.domain.auth.dto.LoginReqDto;
import com.musicjournal.musicjournal.domain.auth.dto.LoginResDto;
import com.musicjournal.musicjournal.domain.auth.dto.SignupReqDto;
import com.musicjournal.musicjournal.domain.auth.entity.RefreshToken;
import com.musicjournal.musicjournal.domain.auth.entity.RefreshTokenRepository;
import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.auth.entity.UserRepository;
import com.musicjournal.musicjournal.exception.CustomException;
import com.musicjournal.musicjournal.exception.ErrorCode;
import com.musicjournal.musicjournal.security.jwt.JwtProperties;
import com.musicjournal.musicjournal.security.jwt.JwtTokenProvider;
import org.springframework.transaction.annotation.Transactional;
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

    // username 사용 가능 여부 확인
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    // email 사용 가능 여부 확인
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    @Transactional
    public void signUp(SignupReqDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // username 중복 체크
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new CustomException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        String hashedPassword = passwordEncoder.encode(dto.getPassword());

        User user = User.builder()
                .email(dto.getEmail())
                .passwordHash(hashedPassword)
                .username(dto.getUsername())
                .nickname(dto.getNickname())
                .build();

        userRepository.save(user);
    }

    @Transactional
    public LoginResDto login(LoginReqDto dto) {
        // 1. email로 user 조회
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 2. password 검증
        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
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

    @Transactional
    public void logout(String email) {
        refreshTokenRepository.deleteByEmail(email);
    }   // SELECT -> DELETE 로 나가므로 트랜잭션으로

    public LoginResDto refresh(String refreshToken) {
        //1. 서명/만료 검증
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        String email = jwtTokenProvider.getEmail(refreshToken);

        //2. DB 저장된 토큰과 일치 여부 확인 - 탈취된 토큰 차단
        RefreshToken stored = refreshTokenRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));

        if (!stored.getToken().equals(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        //3. 새로운 AccessToken 발급
        String newAccessToken = jwtTokenProvider.generateAccessToken(email);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(email);

        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(
                jwtProperties.getExpiration().getRefreshToken() / 1000
        );

        //4. refresh token rotation - 기존 토큰 무효화 후 새 토큰으로 갱신
        stored.updateToken(newRefreshToken, expiresAt);

        return LoginResDto.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }
}
