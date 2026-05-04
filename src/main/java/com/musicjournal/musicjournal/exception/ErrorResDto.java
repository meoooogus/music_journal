package com.musicjournal.musicjournal.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import java.util.Map;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResDto {

    private final String code;
    private final String message;
    private final Map<String, String> validation;   // @Valid 실패 시 상세 정보 담는 용도

    // 일반 에러
    public ErrorResDto(String code, String message) {
        this.code = code;
        this.message = message;
        this.validation = null;
    }

    // validation 에러
    public ErrorResDto(String code, String message, Map<String, String> validation) {
        this.code = code;
        this.message = message;
        this.validation = validation;
    }
}
