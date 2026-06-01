package com.musicjournal.musicjournal.domain.follow.entity;

import com.musicjournal.musicjournal.domain.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    boolean existsByFollowerAndFollowing(User follower, User following);

    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    // 특정 유저의 팔로워 목록 (이 유저를 following하는 사람들)
    List<Follow> findByFollowing(User following);

    // 특정 유저의 팔로잉 목록 (이 유저가 follower인 것들)
    List<Follow> findByFollower(User follower);

    long countByFollowing(User following);

    long countByFollower(User follower);
}
