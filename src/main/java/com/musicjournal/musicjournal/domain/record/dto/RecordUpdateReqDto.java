package com.musicjournal.musicjournal.domain.record.dto;

import com.musicjournal.musicjournal.domain.track.dto.TrackReqDto;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordUpdateReqDto {

    @NotNull(message = "음원을 선택해주세요.")
    private TrackReqDto track;

    @NotNull(message = "기록할 날짜를 선택해주세요.")
    private LocalDate recordedDate;

    private String comment;     // null이면 코멘트 삭제
} // 일단은 update와 create 분리
