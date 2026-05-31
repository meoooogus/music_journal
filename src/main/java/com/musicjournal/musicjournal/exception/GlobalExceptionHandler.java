package com.musicjournal.musicjournal.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // custom
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResDto> handleCustomException(CustomException e) {
        ErrorCode errorCode = e.getErrorCode();

        return ResponseEntity.status(errorCode.getStatus())
                .body(new ErrorResDto(errorCode.getCode(), errorCode.getMessage()));
    }

    // @Valid 유효성 검사 실패 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResDto> handleValidationException(MethodArgumentNotValidException e) {
        Map<String, String> validation = new HashMap<>();

        // 실패한 필드들을 순회하며 수집
        e.getBindingResult().getFieldErrors()
                .forEach(err -> validation.put(err.getField(), err.getDefaultMessage()));

        ErrorCode errorCode = ErrorCode.INVALID_INPUT;
        return ResponseEntity
                .status(errorCode.getStatus())
                .body(new ErrorResDto(errorCode.getCode(), errorCode.getMessage(), validation));
    }

    // 잘못된 JSON 형식 요청
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResDto> handleMessageNotReadable(HttpMessageNotReadableException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResDto("INVALID_INPUT", "요청 본문을 읽을 수 없습니다."));
    }

    // 지원하지 않는 HTTP 메서드
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResDto> handleMethodNotSupported(HttpRequestMethodNotSupportedException e) {
        return ResponseEntity
                .status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(new ErrorResDto("METHOD_NOT_ALLOWED", "지원하지 않는 HTTP 메서드입니다."));
    }

    // 경로 변수 타입 불일치 (e.g. Long에 문자열 전달)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResDto> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResDto("INVALID_INPUT", "요청 파라미터 타입이 올바르지 않습니다."));
    }

    // 예상치 못한 오류
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResDto> handleException(Exception e) {
        log.error("Unexpected error", e);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResDto("INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다"));
    }
}
