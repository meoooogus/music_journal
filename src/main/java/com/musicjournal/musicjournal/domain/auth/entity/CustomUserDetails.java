package com.musicjournal.musicjournal.domain.auth.entity;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user; // 실제 유저 엔티티를 감쌈

    // 추가 정보 접근자 — SecurityContext에서 꺼낼 때 DB 재조회 없이 사용
    public Long getUserId() { return user.getUserId(); }
    public String getRealUsername() { return user.getUsername(); }

    // --- UserDetails 위임 메서드 ---

    @Override
    public String getUsername() {
        return user.getEmail(); // Security는 username으로 이메일을 사용
    }

    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }
}
