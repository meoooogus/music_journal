package com.musicjournal.musicjournal.domain.profile.controller;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.profile.dto.ProfileMyResDto;
import com.musicjournal.musicjournal.domain.profile.dto.ProfileResDto;
import com.musicjournal.musicjournal.domain.profile.dto.ProfileUpdateReqDto;
import com.musicjournal.musicjournal.domain.profile.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/me")
    public ResponseEntity<Void> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ProfileUpdateReqDto dto
    ) {
        profileService.updateProfile(userDetails, dto);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{username}")
    public ResponseEntity<ProfileResDto> getProfile(
            @PathVariable("username") String username
    ) {
        return ResponseEntity.ok(profileService.getProfile(username));
    }
}