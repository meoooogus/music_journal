package com.musicjournal.musicjournal.domain.feed.service;

import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.feed.dto.FeedResDto;
import com.musicjournal.musicjournal.domain.review.entity.AlbumReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FeedService {

    private final AlbumReviewRepository albumReviewRepository;

    // 팔로잉 피드
    public Page<FeedResDto> getFollowingFeed(CustomUserDetails userDetails, Pageable pageable) {
        User user = userDetails.getUser();
        return albumReviewRepository.findFollowingFeed(user, pageable)
                .map(FeedResDto::from);
    }

    // 최신 피드
    public Page<FeedResDto> getLatestFeed(Pageable pageable) {
        return albumReviewRepository.findLatestFeed(pageable)
                .map(FeedResDto::from);
    }
}
