package com.musicjournal.musicjournal.domain.auth.entity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
}
