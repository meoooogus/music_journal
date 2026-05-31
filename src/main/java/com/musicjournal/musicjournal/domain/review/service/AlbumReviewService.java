package com.musicjournal.musicjournal.domain.review.service;

import com.musicjournal.musicjournal.domain.album.dto.AlbumReqDto;
import com.musicjournal.musicjournal.domain.album.entity.Album;
import com.musicjournal.musicjournal.domain.album.entity.AlbumRepository;
import com.musicjournal.musicjournal.domain.album.service.AlbumService;
import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.review.dto.AlbumReviewReqDto;
import com.musicjournal.musicjournal.domain.review.dto.AlbumReviewResDto;
import com.musicjournal.musicjournal.domain.review.dto.RecommendationReqDto;
import com.musicjournal.musicjournal.domain.review.entity.AlbumRecommendation;
import com.musicjournal.musicjournal.domain.review.entity.AlbumReview;
import com.musicjournal.musicjournal.domain.review.entity.AlbumReviewRepository;
import com.musicjournal.musicjournal.exception.CustomException;
import com.musicjournal.musicjournal.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlbumReviewService {
    private final AlbumReviewRepository albumReviewRepository;
    private final AlbumRepository albumRepository;
    private final AlbumService albumService;

    @Transactional
    public AlbumReviewResDto upsertReview(String spotifyAlbumId, AlbumReviewReqDto dto, CustomUserDetails userDetails) {
        // 앨범 조회 - PUT /albums/{spotifyAlbumId} 선행
        Album album = albumRepository.findBySpotifyAlbumId(spotifyAlbumId)
                .orElseThrow(() -> new CustomException(ErrorCode.ALBUM_NOT_FOUND));

        // 기존 리뷰 존재 시 수정, 없으면 신규 생성
        AlbumReview review = albumReviewRepository.findMyReview(userDetails.getUser(), spotifyAlbumId)
                .map(existing -> {
                    existing.update(dto.getRating(), dto.getContent());
                    return existing;
                })
                .orElseGet(() -> albumReviewRepository.save(
                        AlbumReview.builder()
                                .user(userDetails.getUser())
                                .album(album)
                                .rating(dto.getRating())
                                .content(dto.getContent())
                                .build()
                ));

        // 추천 앨범 처리
        review.updateRecommendations(buildRecommendations(dto.getRecommendations(), review));

        return AlbumReviewResDto.from(review);
    }

    @Transactional(readOnly = true)
    public List<AlbumReviewResDto> getReviews(String spotifyAlbumId) {
        // 앨범 미존재 또는 리뷰 없으면 자연스럽게 빈 리스트 반환
        return albumReviewRepository.findReviewsBySpotifyAlbumId(spotifyAlbumId).stream()
                .map(AlbumReviewResDto::from)
                .toList();
    }

    @Transactional
    public void deleteReview(String spotifyAlbumId, CustomUserDetails userDetails) {
        AlbumReview review = albumReviewRepository.findMyReview(userDetails.getUser(), spotifyAlbumId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        albumReviewRepository.delete(review);
    }

    private List<AlbumRecommendation> buildRecommendations(List<RecommendationReqDto> dtos, AlbumReview review) {
        return dtos.stream()
                .map(rec -> {
                    Album recommendedAlbum = albumService.upsert(
                            rec.getSpotifyAlbumId(),
                            toAlbumReqDto(rec)
                    );
                    return AlbumRecommendation.builder()
                            .review(review)
                            .album(recommendedAlbum)
                            .build();
                })
                .toList();
    }

    private AlbumReqDto toAlbumReqDto(RecommendationReqDto rec) {
        return AlbumReqDto.builder()
                .albumName(rec.getAlbumName())
                .artistName(rec.getArtistName())
                .artistId(rec.getArtistId())
                .artworkUrl(rec.getArtworkUrl())
                .releaseDate(rec.getReleaseDate())
                .totalTracks(rec.getTotalTracks())
                .build();
    }
}
