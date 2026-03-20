package com.musicjournal.musicjournal.domain.auth.controller;

import com.musicjournal.musicjournal.domain.auth.dto.SignupReqDto;
import com.musicjournal.musicjournal.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> signUp(@RequestBody SignupReqDto signupReqDto) {
        authService.signUp(signupReqDto);
        return ResponseEntity.ok("회원가입 완료");
    } // HTTP 응답 직접 컨트롤하기 위한 객체
}
