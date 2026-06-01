package com.musicjournal.musicjournal.domain.feed.controller;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.feed.dto.FeedResDto;
import com.musicjournal.musicjournal.domain.feed.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/feed")
public class FeedController {

    private final FeedService feedService;

    @GetMapping("/following")
    public ResponseEntity<Page<FeedResDto>> getFollowingFeed(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            Pageable pageable
    ) {
        return ResponseEntity.ok(feedService.getFollowingFeed(userDetails, pageable));
    }

    @GetMapping("/latest")
    public ResponseEntity<Page<FeedResDto>> getLatestFeed(
            Pageable pageable
    ) {
        return ResponseEntity.ok(feedService.getLatestFeed(pageable));
    }
}
