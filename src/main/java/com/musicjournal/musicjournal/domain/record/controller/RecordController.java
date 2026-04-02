package com.musicjournal.musicjournal.domain.record.controller;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.record.dto.RecordReqDto;
import com.musicjournal.musicjournal.domain.record.dto.RecordResDto;
import com.musicjournal.musicjournal.domain.record.dto.RecordUpdateReqDto;
import com.musicjournal.musicjournal.domain.record.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/records")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    @PostMapping
    public ResponseEntity<RecordResDto> record(
            @RequestBody RecordReqDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(recordService.createRecord(dto, userDetails));
    }

    // 기록 전체 조회 / 날짜별 조회
    @GetMapping
    public ResponseEntity<List<RecordResDto>> getRecords(
            @RequestParam(required = false) LocalDate date,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(recordService.getRecords(date, userDetails));
    }

    // 단건 조회
    @GetMapping("/{recordId}")
    public ResponseEntity<RecordResDto> getRecord(
            @PathVariable Long recordId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(recordService.getRecord(recordId, userDetails));
    }

    @PutMapping("/{recordId}")
    public ResponseEntity<RecordResDto> updateRecord(
            @PathVariable Long recordId,
            @RequestBody RecordUpdateReqDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(recordService.updateRecord(recordId, dto, userDetails));
    }

    @DeleteMapping("/{recordId}")
    public ResponseEntity<Void> deleteRecord(
            @PathVariable Long recordId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        recordService.deleteRecord(recordId, userDetails);
        return ResponseEntity.noContent().build();  // body없이 204 리턴
    }
}
