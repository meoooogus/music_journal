package com.musicjournal.musicjournal.domain.album.controller;

import com.musicjournal.musicjournal.domain.album.dto.AlbumReqDto;
import com.musicjournal.musicjournal.domain.album.dto.TrendingResDto;
import com.musicjournal.musicjournal.domain.album.service.AlbumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/albums")
public class AlbumController {

    private final AlbumService albumService;

    @GetMapping("/trending")
    public ResponseEntity<TrendingResDto> getTrending() {
        return ResponseEntity.ok(albumService.getTrending());
    }

    @PutMapping("/{spotifyAlbumId}")
    public ResponseEntity<Void> upsertAlbum(
            @PathVariable String spotifyAlbumId,
            @Valid @RequestBody AlbumReqDto dto
            ) {
        albumService.upsert(spotifyAlbumId, dto);
        return ResponseEntity.ok().build();
    }
}
