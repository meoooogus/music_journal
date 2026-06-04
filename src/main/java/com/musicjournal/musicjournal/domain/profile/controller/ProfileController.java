package com.musicjournal.musicjournal.domain.profile.controller;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.profile.dto.ProfileMyResDto;
import com.musicjournal.musicjournal.domain.profile.dto.ProfileResDto;
import com.musicjournal.musicjournal.domain.profile.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<ProfileMyResDto> getMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(profileService.getMyProfile(userDetails));
    }

    @GetMapping("/{username}")
    public ResponseEntity<ProfileResDto> getProfile(
            @PathVariable("username") String username
    ) {
        return ResponseEntity.ok(profileService.getProfile(username));
    }
}