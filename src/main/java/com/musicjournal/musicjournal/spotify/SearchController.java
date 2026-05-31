package com.musicjournal.musicjournal.spotify;

import com.musicjournal.musicjournal.exception.CustomException;
import com.musicjournal.musicjournal.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {

    private final SpotifyApiService spotifyApiService;

    // type: "track" or "album"
    @GetMapping
    public ResponseEntity<?> search(@RequestParam String q, @RequestParam String type) {
        return switch (type) {
            case "track" -> ResponseEntity.ok(spotifyApiService.searchTracks(q));
            case "album" -> ResponseEntity.ok(spotifyApiService.searchAlbums(q));
            default -> throw new CustomException(ErrorCode.UNSUPPORTED_SEARCH_TYPE);
        };
    }
}
