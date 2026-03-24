package com.musicjournal.musicjournal.domain.auth.entity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {

    // 이메일로 refresh token 조회
    Optional<RefreshToken> findByEmail(String email);
}
