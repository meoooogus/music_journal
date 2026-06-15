package com.musicjournal.musicjournal.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    //회원가입
    EMAIL_ALREADY_EXISTS(409, "EMAIL_ALREADY_EXISTS", "이미 존재하는 이메일입니다."),
    USERNAME_ALREADY_EXISTS(409, "USERNAME_ALREADY_EXISTS", "이미 존재하는 사용자명입니다."),

    //로그인
    USER_NOT_FOUND(404, "USER_NOT_FOUND", "존재하지 않는 유저입니다."),
    INVALID_PASSWORD(401, "INVALID_PASSWORD", "비밀번호가 일치하지 않습니다."),
    INVALID_REFRESH_TOKEN(401, "INVALID_REFRESH_TOKEN", "유효하지 않은 refresh token입니다."),
    REFRESH_TOKEN_NOT_FOUND(401, "REFRESH_TOKEN_NOT_FOUND", "refresh token이 존재하지 않습니다."),

    //기록 관리
    RECORD_NOT_FOUND(404, "RECORD_NOT_FOUND", "존재하지 않는 기록입니다."),
    RECORD_EDIT_EXPIRED(403, "RECORD_EDIT_EXPIRED", "작성 후 7일이 지난 기록은 수정할 수 없습니다."),
    RECORD_ACCESS_DENIED(403, "RECORD_ACCESS_DENIED", "본인의 기록만 접근할 수 있습니다."),

    //앨범 리뷰
    ALBUM_NOT_FOUND(404, "ALBUM_NOT_FOUND", "존재하지 않는 앨범입니다."),
    REVIEW_NOT_FOUND(404, "REVIEW_NOT_FOUND", "존재하지 않는 리뷰입니다."),

    // 팔로우
    SELF_FOLLOW(400, "SELF_FOLLOW", "자기 자신을 팔로우할 수 없습니다."),
    ALREADY_FOLLOWING(409, "ALREADY_FOLLOWING", "이미 팔로우한 유저입니다."),
    NOT_FOLLOWING(404, "NOT_FOLLOWING", "팔로우하지 않은 유저입니다."),

    //검색
    UNSUPPORTED_SEARCH_TYPE(400, "UNSUPPORTED_SEARCH_TYPE", "지원하지 않는 검색 유형입니다."),

    //외부 API
    EXTERNAL_API_ERROR(502, "EXTERNAL_API_ERROR", "외부 API 호출 중 오류가 발생했습니다."),

    //공통
    INVALID_INPUT(400, "INVALID_INPUT", "입력값을 확인해주세요.");

    private final int status;
    private final String code;
    private final String message;
}
