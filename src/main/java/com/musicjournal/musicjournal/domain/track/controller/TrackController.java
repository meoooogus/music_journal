package com.musicjournal.musicjournal.domain.track.controller;

import com.musicjournal.musicjournal.domain.track.dto.TrackResDto;
import com.musicjournal.musicjournal.spotify.SpotifySearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final SpotifySearchService spotifySearchService;

    @GetMapping("/search")
    public ResponseEntity<List<TrackResDto>> search(@RequestParam String q) {
        return ResponseEntity.ok(spotifySearchService.search(q));
    }
}
