package com.musicjournal.musicjournal.domain.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignupReqDto {

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "비밀번호를 입력해주세요.")
    @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
    private String password;

    @NotBlank(message = "사용할 이름을 입력해주세요.")
    @Pattern(regexp = "^[a-z0-9_]{3,20}$", message = "영문 소문자, 숫자, _ 조합 3–20자여야 합니다.")
    private String username;

    @NotBlank(message = "닉네임을 입력해주세요.")
    private String nickname;
}
