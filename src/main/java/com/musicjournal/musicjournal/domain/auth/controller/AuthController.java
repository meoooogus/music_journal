package com.musicjournal.musicjournal.domain.auth.controller;

import com.musicjournal.musicjournal.domain.auth.dto.LoginReqDto;
import com.musicjournal.musicjournal.domain.auth.dto.LoginResDto;
import com.musicjournal.musicjournal.domain.auth.dto.RefreshReqDto;
import com.musicjournal.musicjournal.domain.auth.dto.SignupReqDto;
import com.musicjournal.musicjournal.domain.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@Valid @RequestBody SignupReqDto signupReqDto) {
        authService.signUp(signupReqDto);
        return ResponseEntity.ok("회원가입 완료");
    } // HTTP 응답 직접 컨트롤하기 위한 객체

    @PostMapping("/login")
    public ResponseEntity<LoginResDto> login(@Valid @RequestBody LoginReqDto loginReqDto) {
        return ResponseEntity.ok(authService.login(loginReqDto));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal UserDetails userDetails) {
        authService.logout(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResDto> refresh(@RequestBody RefreshReqDto refreshReqDto) {
        return ResponseEntity.ok(authService.refresh(refreshReqDto.getRefreshToken()));
    } // 토큰 url 노출 방지
}
