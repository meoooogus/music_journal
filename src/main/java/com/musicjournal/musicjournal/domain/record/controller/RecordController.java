package com.musicjournal.musicjournal.domain.record.controller;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.record.entity.Weather;
import com.musicjournal.musicjournal.domain.record.dto.RecordReqDto;
import com.musicjournal.musicjournal.domain.record.dto.RecordResDto;
import com.musicjournal.musicjournal.domain.record.dto.RecordUpdateReqDto;
import com.musicjournal.musicjournal.domain.record.service.RecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/weather-types")
    public ResponseEntity<Weather[]> getWeatherTypes() {
        return ResponseEntity.ok(Weather.values());
    }

    @PostMapping
    public ResponseEntity<RecordResDto> record(
            @Valid @RequestBody RecordReqDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recordService.createRecord(dto, userDetails));
    }

    // 기록 전체 조회 / 날짜별 조회
    @GetMapping
    public ResponseEntity<List<RecordResDto>> getRecords(
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(recordService.getRecords(date, year, month, userDetails));
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
            @Valid @RequestBody RecordUpdateReqDto dto,
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
