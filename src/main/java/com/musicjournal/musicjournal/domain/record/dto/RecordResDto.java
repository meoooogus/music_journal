package com.musicjournal.musicjournal.domain.record.dto;

import com.musicjournal.musicjournal.domain.record.entity.Record;
import com.musicjournal.musicjournal.domain.track.dto.TrackResDto;
import com.musicjournal.musicjournal.domain.track.entity.Track;
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

    public static RecordResDto from(Record record) {
        Track track = record.getTrack();

        return RecordResDto.builder()
                .comment(record.getComment())
                .recordedDate(record.getRecordedDate())
                .trackTitle(track.getTitle())
                .albumName(track.getAlbumName())
                .artistName(track.getArtistName())
                .artworkUrl(track.getArtworkUrl())
                .build();
    }
}
