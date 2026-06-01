package com.musicjournal.musicjournal.domain.profile.service;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.auth.entity.UserRepository;
import com.musicjournal.musicjournal.domain.profile.dto.ProfileMyResDto;
import com.musicjournal.musicjournal.domain.profile.dto.ProfileResDto;
import com.musicjournal.musicjournal.domain.profile.dto.ProfileReviewResDto;
import com.musicjournal.musicjournal.domain.profile.dto.ProfileUpdateReqDto;
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
                .nickname(user.getNickname())
                .followerCount(followRepository.countByFollowing(user))
                .followingCount(followRepository.countByFollower(user))
                .reviewCount(reviews.size())
                .reviews(reviews)
                .stat(stat)
                .build();
    }

    // 프로필 수정
    @Transactional
    public void updateProfile(CustomUserDetails userDetails, ProfileUpdateReqDto dto) {
        // Security Context의 User는 detached 상태 → managed 엔티티로 다시 조회해야 dirty checking 작동
        User user = userRepository.findById(userDetails.getUser().getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // username 변경 시, 다른 유저가 이미 사용 중인지 체크
        if (!user.getUsername().equals(dto.getUsername())
                && userRepository.existsByUsername(dto.getUsername())) {
            throw new CustomException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        user.updateProfile(dto.getUsername(), dto.getNickname());
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
                .nickname(user.getNickname())
                .followerCount(followRepository.countByFollowing(user))
                .followingCount(followRepository.countByFollower(user))
                .reviewCount(reviews.size())
                .reviews(reviews)
                .build();
    }
}
