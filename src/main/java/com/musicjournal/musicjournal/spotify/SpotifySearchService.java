package com.musicjournal.musicjournal.spotify;

import com.musicjournal.musicjournal.domain.album.dto.AlbumResDto;
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

    public List<Map<String, Object>> fetchItems(String query, String type) {
        String token = spotifyTokenService.getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        String url = spotifyProperties.getApiBaseUrl() + "/search?q=" + query + "&type=" + type + "&limit=10";

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
