package com.musicjournal.musicjournal.domain.follow.controller;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.follow.dto.FollowUserResDto;
import com.musicjournal.musicjournal.domain.follow.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users/{username}")
public class FollowController {

    private final FollowService followService;

    @PostMapping("/follow")
    public ResponseEntity<Void> follow(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("username") String username
    ) {
        followService.follow(userDetails, username);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/follow")
    public ResponseEntity<Void> unfollow(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("username") String username
    ) {
        followService.unfollow(userDetails, username);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/followers")
    public ResponseEntity<List<FollowUserResDto>> getFollowers(
            @PathVariable("username") String username
    ) {
        return ResponseEntity.ok(followService.getFollowers(username));
    }

    @GetMapping("/followings")
    public ResponseEntity<List<FollowUserResDto>> getFollowings(
            @PathVariable("username") String username
    ) {
        return ResponseEntity.ok(followService.getFollowings(username));
    }
}
