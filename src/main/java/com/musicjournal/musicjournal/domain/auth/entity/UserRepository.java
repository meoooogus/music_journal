package com.musicjournal.musicjournal.domain.auth.entity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Boolean existsByEmail(String email); // 존재 여부 확인
}
