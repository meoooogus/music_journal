package com.musicjournal.musicjournal.spotify;

import com.musicjournal.musicjournal.domain.track.dto.TrackResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SpotifySearchService {

    private final SpotifyProperties spotifyProperties;
    private final SpotifyTokenService spotifyTokenService;
    private final RestTemplate restTemplate;

    public List<TrackResDto> search(String query) {
        String token = spotifyTokenService.getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        String url = spotifyProperties.getApiBaseUrl() + "/search?q=" + query + "&type=track&limit=10";

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class
        );

        // 응답에서 tracks.items 추출
        Map<String, Object> body = response.getBody();

        Map<String, Object> tracks = (Map<String, Object>) body.get("tracks");
        List<Map<String, Object>> items = (List<Map<String, Object>>) tracks.get("items");

        return items.stream()
                .map(this::mapToDto)
                .toList();
    }

    private TrackResDto mapToDto(Map<String, Object> item) {
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

}
