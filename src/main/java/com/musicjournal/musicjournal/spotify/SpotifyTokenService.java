package com.musicjournal.musicjournal.spotify;

import com.musicjournal.musicjournal.exception.CustomException;
import com.musicjournal.musicjournal.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpotifyTokenService {

    private final SpotifyProperties spotifyProperties;
    private final RestTemplate restTemplate;

    public String getAccessToken() {
        // clientId: clientSecret을 Base64로 인코딩 - Spotify Basic Auth 규격
        String credentials = spotifyProperties.getClientId() + ":" + spotifyProperties.getClientSecret();
        String encoded = Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "Basic " + encoded);

        LinkedMultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");

        HttpEntity<LinkedMultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        // Spotify token 엔드포인트 호출
        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    spotifyProperties.getTokenUrl(),
                    HttpMethod.POST,
                    request,
                    Map.class
            );
            return (String) response.getBody().get("access_token");
        } catch (RestClientException e) {
            log.error("Spotify 토큰 발급 실패", e);
            throw new CustomException(ErrorCode.EXTERNAL_API_ERROR);
        }
    }
}
