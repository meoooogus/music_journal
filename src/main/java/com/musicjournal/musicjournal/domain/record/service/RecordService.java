package com.musicjournal.musicjournal.domain.record.service;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.record.dto.RecordReqDto;
import com.musicjournal.musicjournal.domain.record.dto.RecordResDto;
import com.musicjournal.musicjournal.domain.record.entity.Record;
import com.musicjournal.musicjournal.domain.record.entity.RecordRepository;
import com.musicjournal.musicjournal.domain.track.entity.Track;
import com.musicjournal.musicjournal.domain.track.entity.TrackRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final RecordRepository recordRepository;
    private final TrackRepository trackRepository;

    @Transactional
    public RecordResDto createRecord(RecordReqDto dto, CustomUserDetails userDetails) {
        Track track = trackRepository.findBySpotifyId(dto.getSpotifyId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 트랙입니다."));

        // 현재 로그인 유저 조회
        User user = userDetails.getUser();

        Record record = recordRepository.save(
                Record.builder()
                        .user(user)
                        .track(track)
                        .recordedDate(dto.getRecordedDate())
                        .comment(dto.getComment())
                        .build()
        );

        return RecordResDto.from(record);
    }
}
