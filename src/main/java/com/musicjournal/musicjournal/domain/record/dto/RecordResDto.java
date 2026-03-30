package com.musicjournal.musicjournal.domain.record.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordResDto {

    private Long recordId;
    private String comment;
    private LocalDate recordedDate;
    private String trackTitle;
    private String albumName;
    private String artistName;
    private String artworkUrl;
}
