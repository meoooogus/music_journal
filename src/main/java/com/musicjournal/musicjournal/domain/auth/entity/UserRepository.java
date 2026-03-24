package com.musicjournal.musicjournal.domain.auth.entity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Boolean existsByEmail(String email); // 존재 여부 확인
    Optional<User> findByEmail(String email); // 로그인 시 유저 조회
}
