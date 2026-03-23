package com.musicjournal.musicjournal.domain.auth.service;

import com.musicjournal.musicjournal.domain.auth.dto.SignupReqDto;
import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.auth.entity.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
}
