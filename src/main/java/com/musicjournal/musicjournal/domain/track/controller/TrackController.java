package com.musicjournal.musicjournal.domain.track.controller;

import com.musicjournal.musicjournal.domain.track.dto.TrackReqDto;
import com.musicjournal.musicjournal.domain.track.dto.TrackResDto;
import com.musicjournal.musicjournal.domain.track.service.TrackService;
import com.musicjournal.musicjournal.spotify.SpotifySearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final SpotifySearchService spotifySearchService;
    private final TrackService trackService;

    @GetMapping("/search")
    public ResponseEntity<List<TrackResDto>> search(@RequestParam String q) {
        return ResponseEntity.ok(spotifySearchService.search(q));
    }

    @PostMapping
    public ResponseEntity<TrackResDto> save(@RequestBody TrackReqDto dto) {
        return ResponseEntity.ok(trackService.upsert(dto));
    }
}
