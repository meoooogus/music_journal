package com.musicjournal.musicjournal.domain.album.controller;

import com.musicjournal.musicjournal.domain.album.dto.AlbumDetailResDto;
import com.musicjournal.musicjournal.domain.album.dto.AlbumReqDto;
import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.review.dto.TrendingResDto;
import com.musicjournal.musicjournal.domain.album.service.AlbumService;
import com.musicjournal.musicjournal.domain.review.service.AlbumReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/albums")
public class AlbumController {

    private final AlbumService albumService;
    private final AlbumReviewService albumReviewService;

    @GetMapping("/{spotifyAlbumId}")
    public ResponseEntity<AlbumDetailResDto> getAlbumDetail(
            @PathVariable String spotifyAlbumId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(albumService.getAlbumDetail(spotifyAlbumId, userDetails.getUser()));
    }

    @GetMapping("/trending")
    public ResponseEntity<TrendingResDto> getTrending() {
        return ResponseEntity.ok(albumReviewService.getTrending());
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
