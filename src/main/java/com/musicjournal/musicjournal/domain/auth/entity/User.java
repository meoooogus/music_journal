package com.musicjournal.musicjournal.domain.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Table(name = "users")
public class User {

    @Id //PK(기본키)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true) // 이메일 중복 금지
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, unique = true)
    private String username;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(userId, user.userId) && Objects.equals(email, user.email) && Objects.equals(passwordHash, user.passwordHash) && Objects.equals(username, user.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, email, passwordHash, username);
    }
}
