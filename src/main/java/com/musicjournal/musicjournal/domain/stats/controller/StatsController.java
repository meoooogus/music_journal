package com.musicjournal.musicjournal.domain.stats.controller;

import com.musicjournal.musicjournal.domain.stats.dto.StatsResDto;
import com.musicjournal.musicjournal.domain.stats.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    public ResponseEntity<StatsResDto> getStats(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(statsService.getStats(email));
    }
}
