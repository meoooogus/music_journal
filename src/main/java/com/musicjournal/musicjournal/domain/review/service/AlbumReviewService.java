package com.musicjournal.musicjournal.domain.review.service;

import com.musicjournal.musicjournal.domain.album.dto.AlbumReqDto;
import com.musicjournal.musicjournal.domain.album.entity.Album;
import com.musicjournal.musicjournal.domain.album.service.AlbumService;
import com.musicjournal.musicjournal.domain.auth.entity.CustomUserDetails;
import com.musicjournal.musicjournal.domain.review.dto.AlbumReviewReqDto;
import com.musicjournal.musicjournal.domain.review.dto.AlbumReviewResDto;
import com.musicjournal.musicjournal.domain.review.dto.RecommendationReqDto;
import com.musicjournal.musicjournal.domain.review.dto.TrendingResDto;
import com.musicjournal.musicjournal.domain.review.entity.AlbumRecommendation;
import com.musicjournal.musicjournal.domain.review.entity.AlbumReview;
import com.musicjournal.musicjournal.domain.review.entity.AlbumReviewRepository;
import com.musicjournal.musicjournal.domain.review.entity.AlbumReviewTrendingRepository;
import com.musicjournal.musicjournal.exception.CustomException;
import com.musicjournal.musicjournal.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlbumReviewService {
    private final AlbumReviewRepository albumReviewRepository;
    private final AlbumReviewTrendingRepository albumReviewTrendingRepository;
    private final AlbumService albumService;

    @Transactional
    public AlbumReviewResDto upsertReview(String spotifyAlbumId, AlbumReviewReqDto dto, CustomUserDetails userDetails) {
        // 앨범 조회 - PUT /albums/{spotifyAlbumId} 선행
        Album album = albumService.getBySpotifyAlbumId(spotifyAlbumId);

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

        // 추천 앨범 처리 — DTO 필드 기본값이 new ArrayList<>()이지만,
        // 클라이언트가 "recommendations": null로 보내면 Jackson이 null로 덮어씀
        // (프론트엔드 실수, Postman/curl 직접 호출, 외부 서비스 연동 등)
        List<RecommendationReqDto> recs = dto.getRecommendations();
        review.updateRecommendations(
                recs == null ? List.of() : buildRecommendations(recs, review)
        );

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

    @Transactional(readOnly = true)
    public TrendingResDto getTrending() {
        // 최근 30일 기준 trending 조회
        LocalDateTime since = LocalDate.now().minusDays(30).atStartOfDay();
        Pageable topN = PageRequest.of(0, 5);

        // 최근 30일 리뷰 수 TOP 5
        List<TrendingResDto.MostReviewedDto> mostReviewed = albumReviewTrendingRepository
                .findMostReviewed(since, topN).stream()
                .map(p -> TrendingResDto.MostReviewedDto.builder()
                        .spotifyAlbumId(p.getSpotifyAlbumId())
                        .albumName(p.getAlbumName())
                        .artistName(p.getArtistName())
                        .artworkUrl(p.getArtworkUrl())
                        .reviewCount(p.getReviewCount())
                        .build())
                .toList();

        // 최근 30일 평균 평점 TOP 5
        List<TrendingResDto.HighestRatedDto> highestRated = albumReviewTrendingRepository
                .findHighestRated(since, topN).stream()
                .map(p -> TrendingResDto.HighestRatedDto.builder()
                        .spotifyAlbumId(p.getSpotifyAlbumId())
                        .albumName(p.getAlbumName())
                        .artistName(p.getArtistName())
                        .artworkUrl(p.getArtworkUrl())
                        .avgRating(p.getAvgRating())
                        .build())
                .toList();

        return TrendingResDto.builder()
                .mostReviewed(mostReviewed)
                .highestRated(highestRated)
                .build();
    }
}
