package com.musicjournal.musicjournal.domain.record.service;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.record.dto.RecordReqDto;
import com.musicjournal.musicjournal.domain.record.dto.RecordResDto;
import com.musicjournal.musicjournal.domain.record.dto.RecordUpdateReqDto;
import com.musicjournal.musicjournal.domain.record.entity.Record;
import com.musicjournal.musicjournal.domain.record.entity.RecordRepository;
import com.musicjournal.musicjournal.domain.track.entity.Track;
import com.musicjournal.musicjournal.domain.track.service.TrackService;
import com.musicjournal.musicjournal.exception.CustomException;
import com.musicjournal.musicjournal.exception.ErrorCode;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final RecordRepository recordRepository;
    private final TrackService trackService;

    @Transactional
    public RecordResDto createRecord(RecordReqDto dto, CustomUserDetails userDetails) {
        // TrackService를 통해 upsert — 레이어 원칙 준수
        Track track = trackService.upsert(dto.getTrack());

        // 현재 로그인 유저 조회
        User user = userDetails.getUser();

        Record record = recordRepository.save(
                Record.builder()
                        .user(user)
                        .track(track)
                        .recordedDate(dto.getRecordedDate())
                        .comment(dto.getComment())
                        .weather(dto.getWeather())
                        .build()
        );

        return RecordResDto.from(record);
    }

    @Transactional
    public RecordResDto updateRecord(Long recordId, RecordUpdateReqDto dto, CustomUserDetails userDetails) {
        // 없으면 404
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new CustomException(ErrorCode.RECORD_NOT_FOUND));

        if (!record.getUser().equals(userDetails.getUser())) {
            throw new CustomException(ErrorCode.RECORD_NOT_FOUND);
        } // 타인의 기록에 대해서 record 자체를 숨김

        if (record.getCreatedAt().plusDays(7).isBefore(LocalDateTime.now())) {
            throw new CustomException(ErrorCode.RECORD_EDIT_EXPIRED);
        }

        Track track = trackService.upsert(dto.getTrack());

        record.update(track, dto.getRecordedDate(), dto.getComment(), dto.getWeather());

        //Transactional에서는 존재하는 entity에 대해서, 종료 후 자동으로 UPDATE 쿼리를 날려서 명시적 save() 불필요

        return RecordResDto.from(record);
    }

    @Transactional(readOnly = true)
    public List<RecordResDto> getRecords(LocalDate date, Integer year, Integer month, CustomUserDetails userDetails) {
        User user = userDetails.getUser();

        List<Record> records;

        if (date != null) {
            records = recordRepository.findByUserAndRecordedDate(user, date);
        } else if (year != null && month != null) {
            records = recordRepository.findByUserAndYearMonth(user, year, month);
        } else {
            records = recordRepository.findByUser(user);
        }

        return records.stream()
                .map(RecordResDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public RecordResDto getRecord(Long recordId, CustomUserDetails userDetails) {
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new CustomException(ErrorCode.RECORD_NOT_FOUND));

        if (!record.getUser().equals(userDetails.getUser())) {
            throw new CustomException(ErrorCode.RECORD_NOT_FOUND);
        }

        return RecordResDto.from(record);
    }

    @Transactional
    public void deleteRecord(Long recordId, CustomUserDetails userDetails) {
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new CustomException(ErrorCode.RECORD_NOT_FOUND));
        if (!record.getUser().equals(userDetails.getUser())) {
            throw new CustomException(ErrorCode.RECORD_NOT_FOUND);
        }

        recordRepository.delete(record);
    }
}
