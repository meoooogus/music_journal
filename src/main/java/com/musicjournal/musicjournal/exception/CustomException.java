package com.musicjournal.musicjournal.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
public class CustomException extends RuntimeException{
    private final ErrorCode errorCode;

    public CustomException(ErrorCode errorCode) {
        super(errorCode.getMessage()); // RuntimeException에 메시지 전달 → getMessage() 정상 동작
        this.errorCode = errorCode;
    }
}
