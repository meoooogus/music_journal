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
public class RecordUpdateReqDto {

    private TrackReqDto track;
    private LocalDate recordedDate;
    private String comment;     // null이면 코멘트 삭제
} // 일단은 update와 create 분리
