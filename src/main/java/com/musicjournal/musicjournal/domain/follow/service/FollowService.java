package com.musicjournal.musicjournal.domain.follow.service;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.auth.entity.UserRepository;
import com.musicjournal.musicjournal.domain.follow.dto.FollowUserResDto;
import com.musicjournal.musicjournal.domain.follow.entity.Follow;
import com.musicjournal.musicjournal.domain.follow.entity.FollowRepository;
import com.musicjournal.musicjournal.exception.CustomException;
import com.musicjournal.musicjournal.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    // 팔로우
    @Transactional
    public void follow(CustomUserDetails userDetails, String username) {
        User follower = userDetails.getUser();
        User following = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 자기 자신 팔로우 방지
        if (follower.getUserId().equals(following.getUserId())) {
            throw new CustomException(ErrorCode.SELF_FOLLOW);
        }

        // 중복 팔로우 방지
        if (followRepository.existsByFollowerAndFollowing(follower, following)) {
            throw new CustomException(ErrorCode.ALREADY_FOLLOWING);
        }

        followRepository.save(Follow.builder()
                .follower(follower)
                .following(following)
                .build());
    }

    // 언팔로우
    @Transactional
    public void unfollow(CustomUserDetails userDetails, String username) {
        User follower = userDetails.getUser();
        User following = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOLLOWING));

        followRepository.delete(follow);
    }

    // 팔로워 목록
    public List<FollowUserResDto> getFollowers(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        return followRepository.findByFollowing(user).stream()
                .map(follow -> FollowUserResDto.from(follow.getFollower()))
                .toList();
    }

    // 팔로잉 목록
    public List<FollowUserResDto> getFollowings(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        return followRepository.findByFollower(user).stream()
                .map(follow -> FollowUserResDto.from(follow.getFollowing()))
                .toList();
    }
}
