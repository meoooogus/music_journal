package com.musicjournal.musicjournal.domain.auth.service;

import com.musicjournal.musicjournal.domain.auth.dto.LoginReqDto;
import com.musicjournal.musicjournal.domain.auth.dto.LoginResDto;
import com.musicjournal.musicjournal.domain.auth.dto.SignupReqDto;
import jakarta.transaction.Transactional;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    void 유효하지_않은_토큰으로_재발급_시도시_예외발생() {
        String invalidToken = "invalid.token.value";

        Assertions.assertThatThrownBy(() -> authService.refresh(invalidToken))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("유효하지 않은 refresh token입니다.");
    }

    @Test
    void DB에_존재하지_않는_토큰으로_재발급_시도시_예외발생() {
        SignupReqDto signup = new SignupReqDto("kdh031230", "qwer1234", "kdh");
        authService.signUp(signup);

        LoginResDto loginRes = authService.login(new LoginReqDto("kdh031230", "qwer1234"));

        String validRefreshToken = loginRes.getRefreshToken();

        Assertions.assertThatThrownBy(() -> authService.refresh(validRefreshToken + "tampered"))
                .isInstanceOf(RuntimeException.class);
    }
}