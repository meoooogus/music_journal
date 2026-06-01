package com.musicjournal.musicjournal.domain.profile.service;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.auth.entity.UserRepository;
import com.musicjournal.musicjournal.domain.profile.dto.ProfileMyResDto;
import com.musicjournal.musicjournal.domain.profile.dto.ProfileResDto;
import com.musicjournal.musicjournal.domain.profile.dto.ProfileReviewResDto;
import com.musicjournal.musicjournal.domain.follow.entity.FollowRepository;
import com.musicjournal.musicjournal.domain.review.entity.AlbumReviewRepository;
import com.musicjournal.musicjournal.domain.stats.dto.StatsResDto;
import com.musicjournal.musicjournal.domain.stats.service.StatsService;
import com.musicjournal.musicjournal.exception.CustomException;
import com.musicjournal.musicjournal.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfileService {

    private final AlbumReviewRepository albumReviewRepository;
    private final UserRepository userRepository;
    private final StatsService statsService;
    private final FollowRepository followRepository;

    // 내 프로필 조회
    public ProfileMyResDto getMyProfile(CustomUserDetails userDetails) {
        User user = userDetails.getUser();

        List<ProfileReviewResDto> reviews = albumReviewRepository
                .findByUserOrderByCreatedAtDesc(user).stream()
                .map(ProfileReviewResDto::from)
                .toList();

        StatsResDto stat = statsService.getStats(user.getEmail());

        return ProfileMyResDto.builder()
                .username(user.getUsername())
                .followerCount(followRepository.countByFollowing(user))
                .followingCount(followRepository.countByFollower(user))
                .reviewCount(reviews.size())
                .reviews(reviews)
                .stat(stat)
                .build();
    }

    public ProfileResDto getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<ProfileReviewResDto> reviews = albumReviewRepository
                .findByUserOrderByCreatedAtDesc(user).stream()
                .map(ProfileReviewResDto::from)
                .toList();

        return ProfileResDto.builder()
                .username(username)
                .followerCount(followRepository.countByFollowing(user))
                .followingCount(followRepository.countByFollower(user))
                .reviewCount(reviews.size())
                .reviews(reviews)
                .build();
    }
}
