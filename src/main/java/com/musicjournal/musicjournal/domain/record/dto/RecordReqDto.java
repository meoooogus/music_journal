package com.musicjournal.musicjournal.domain.record.dto;

import com.musicjournal.musicjournal.domain.track.dto.TrackReqDto;
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

    private TrackReqDto track;
    private LocalDate recordedDate;
    private String comment;     // 코멘트 없이도 기록 가능
}
