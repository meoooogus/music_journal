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

    // 내 리뷰 upsert — 대상 리소스가 (인증 user, album)로 이미 확정된 단일 self-resource이므로
    // idempotent PUT + /me 서브리소스가 올바른 의미론 (컬렉션 URI인 /reviews로의 PUT은 "전체 교체"를 뜻함)
    @PutMapping("/me")
    public ResponseEntity<AlbumReviewResDto> upsertReview(
            @PathVariable String spotifyAlbumId,
            @Valid @RequestBody AlbumReviewReqDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(albumReviewService.upsertReview(spotifyAlbumId, dto, userDetails));
    }

    // 앨범의 전체 리뷰 목록 — 진짜 컬렉션이므로 GET /reviews 유지
    @GetMapping
    public ResponseEntity<List<AlbumReviewResDto>> getReviews(
            @PathVariable String spotifyAlbumId
    ) {
        return ResponseEntity.ok(albumReviewService.getReviews(spotifyAlbumId));
    }

    // 내 리뷰만 삭제 — upsert와 동일하게 단일 self-resource 대상이므로 /me
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteReview(
            @PathVariable String spotifyAlbumId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        albumReviewService.deleteReview(spotifyAlbumId, userDetails);
        return ResponseEntity.noContent().build();
    }
}
