package com.musicjournal.musicjournal.domain.record.dto;

import com.musicjournal.musicjournal.domain.track.dto.TrackReqDto;
import jakarta.validation.Valid;
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
public class RecordReqDto {

    @NotNull(message = "음원을 선택해주세요.")
    private TrackReqDto track;

    @NotNull(message = "기록할 날짜를 입력해주세요.")
    private LocalDate recordedDate;

    private String comment;     // 코멘트 없이도 기록 가능
}
