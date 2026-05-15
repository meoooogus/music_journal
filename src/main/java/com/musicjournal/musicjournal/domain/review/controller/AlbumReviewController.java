package com.musicjournal.musicjournal.domain.review.controller;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.review.dto.AlbumReviewReqDto;
import com.musicjournal.musicjournal.domain.review.dto.AlbumReviewResDto;
import com.musicjournal.musicjournal.domain.review.service.AlbumReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/albums/{spotifyAlbumId}/reviews")
public class AlbumReviewController {

    private final AlbumReviewService albumReviewService;

    @PostMapping
    public ResponseEntity<AlbumReviewResDto> upsertReview(
            @PathVariable String spotifyAlbumId,
            @Valid @RequestBody AlbumReviewReqDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(albumReviewService.upsertReview(spotifyAlbumId, dto, userDetails));
    }

    @GetMapping
    public ResponseEntity<List<AlbumReviewResDto>> getReviews(
            @PathVariable String spotifyAlbumId
    ) {
        return ResponseEntity.ok(albumReviewService.getReviews(spotifyAlbumId));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteReview(
            @PathVariable String spotifyAlbumId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        albumReviewService.deleteReview(spotifyAlbumId, userDetails);
        return ResponseEntity.noContent().build();
    }
}
