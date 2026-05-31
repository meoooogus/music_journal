package com.musicjournal.musicjournal.spotify;

import com.musicjournal.musicjournal.domain.album.dto.AlbumResDto;
import com.musicjournal.musicjournal.domain.track.dto.TrackResDto;
import com.musicjournal.musicjournal.exception.CustomException;
import com.musicjournal.musicjournal.exception.ErrorCode;
import com.musicjournal.musicjournal.spotify.dto.AlbumTrackResDto;
import com.musicjournal.musicjournal.spotify.dto.SpotifyAlbumResDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpotifyApiService {

    private final SpotifyProperties spotifyProperties;
    private final SpotifyTokenService spotifyTokenService;
    private final RestTemplate restTemplate;

    public List<Map<String, Object>> fetchItems(String query, String type) {
        String token = spotifyTokenService.getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        String url = spotifyProperties.getApiBaseUrl() + "/search?q=" + query + "&type=" + type + "&limit=10";

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    Map.class
            );

            // 응답에서 tracks.items 추출
            Map<String, Object> body = response.getBody();
            Map<String, Object> results = (Map<String, Object>) body.get(type + "s");
            return (List<Map<String, Object>>) results.get("items");
        } catch (RestClientException e) {
            log.error("Spotify 검색 API 호출 실패 - type: {}", type, e);
            throw new CustomException(ErrorCode.EXTERNAL_API_ERROR);
        }
    }

    public List<TrackResDto> searchTracks(String query) {
        return fetchItems(query, "track").stream()
                .map(this::mapToTrackDto)
                .toList();
    }
    public List<AlbumResDto> searchAlbums(String query) {
        return fetchItems(query, "album").stream()
                .map(this::mapToAlbumDto)
                .toList();
    }

    private TrackResDto mapToTrackDto(Map<String, Object> item) {
        // artist 배열에서 첫 번째 아티스트 추출
        List<Map<String, Object>> artists = (List<Map<String, Object>>) item.get("artists");
        Map<String, Object> artist = artists.get(0);

        // album 정보 추출
        Map<String, Object> album = (Map<String, Object>) item.get("album");
        List<Map<String, Object>> images = (List<Map<String, Object>>) album.get("images");

        return TrackResDto.builder()
                .spotifyId((String) item.get("id"))
                .title((String) item.get("name"))
                .artistName((String) artist.get("name"))
                .artistId((String) artist.get("id"))
                .albumName((String) album.get("name"))
                .albumId((String) album.get("id"))
                .artworkUrl(images.isEmpty() ? null : (String) images.get(0).get("url"))
                .durationMs((Integer) item.get("duration_ms"))
                .build();
    }

    // Spotify GET /v1/albums/{id} → 앨범 메타 + 트랙 한 번에 조회
    public SpotifyAlbumResDto getAlbumDetail(String spotifyAlbumId) {
        String token = spotifyTokenService.getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        String url = spotifyProperties.getApiBaseUrl() + "/albums/" + spotifyAlbumId;

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), Map.class);
            return mapToSpotifyAlbumDto(response.getBody());
        } catch (RestClientException e) {
            log.error("Spotify 앨범 상세 API 호출 실패 - albumId: {}", spotifyAlbumId, e);
            throw new CustomException(ErrorCode.EXTERNAL_API_ERROR);
        }
    }

    private SpotifyAlbumResDto mapToSpotifyAlbumDto(Map<String, Object> body) {
        // 아티스트 추출 (여러 명이면 콤마 구분)
        List<Map<String, Object>> artists = (List<Map<String, Object>>) body.get("artists");
        String artistName = artists.stream()
                .map(a -> (String) a.get("name"))
                .collect(Collectors.joining(", "));

        // 앨범 커버 이미지
        List<Map<String, Object>> images = (List<Map<String, Object>>) body.get("images");

        // Spotify URL
        Map<String, String> externalUrls = (Map<String, String>) body.get("external_urls");

        // 트랙 목록 추출
        Map<String, Object> tracksObj = (Map<String, Object>) body.get("tracks");
        List<Map<String, Object>> trackItems = (List<Map<String, Object>>) tracksObj.get("items");

        List<AlbumTrackResDto> tracks = trackItems.stream()
                .map(this::mapToAlbumTrackDto)
                .toList();

        return SpotifyAlbumResDto.builder()
                .spotifyAlbumId((String) body.get("id"))
                .albumName((String) body.get("name"))
                .artistName(artistName)
                .artworkUrl(images.isEmpty() ? null : (String) images.get(0).get("url"))
                .releaseDate((String) body.get("release_date"))
                .totalTracks((Integer) body.get("total_tracks"))
                .spotifyUrl(externalUrls.get("spotify"))
                .tracks(tracks)
                .build();
    }

    private AlbumTrackResDto mapToAlbumTrackDto(Map<String, Object> item) {
        // 트랙 아티스트 (피처링 포함 시 콤마 구분)
        List<Map<String, Object>> artists = (List<Map<String, Object>>) item.get("artists");
        String artistName = artists.stream()
                .map(a -> (String) a.get("name"))
                .collect(Collectors.joining(", "));

        return AlbumTrackResDto.builder()
                .spotifyId((String) item.get("id"))
                .discNumber((Integer) item.get("disc_number"))
                .trackNumber((Integer) item.get("track_number"))
                .title((String) item.get("name"))
                .artistName(artistName)
                .durationMs((Integer) item.get("duration_ms"))
                .build();
    }

    private AlbumResDto mapToAlbumDto(Map<String, Object> item) {
        // artist 배열에서 첫 번째 아티스트 추출
        List<Map<String, Object>> artists = (List<Map<String, Object>>) item.get("artists");
        Map<String, Object> artist = artists.get(0);
        List<Map<String, Object>> images = (List<Map<String, Object>>) item.get("images");

        return AlbumResDto.builder()
                .spotifyAlbumId((String) item.get("id"))
                .albumName((String) item.get("name"))
                .artistName((String) artist.get("name"))
                .artistId((String) artist.get("id"))
                .artworkUrl(images.isEmpty() ? null : (String) images.get(0).get("url"))
                .releaseDate((String) item.get("release_date"))
                .totalTracks((Integer) item.get("total_tracks"))
                .build();
    }

}
