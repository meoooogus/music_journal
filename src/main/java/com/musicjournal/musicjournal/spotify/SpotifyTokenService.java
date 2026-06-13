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
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpotifyTokenService {

    private final SpotifyProperties spotifyProperties;
    private final RestTemplate restTemplate;

    // 토큰 캐싱 — Spotify 토큰은 보통 3600초 유효, 매 요청마다 재발급 방지
    private String cachedToken;
    private Instant tokenExpiry = Instant.EPOCH;
    private static final int EXPIRY_MARGIN_SECONDS = 60; // 만료 60초 전에 갱신

    public synchronized String getAccessToken() {
        // 캐시된 토큰이 아직 유효하면 재사용
        if (cachedToken != null && Instant.now().isBefore(tokenExpiry)) {
            return cachedToken;
        }

        // clientId:clientSecret을 Base64로 인코딩 - Spotify Basic Auth 규격
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
            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    spotifyProperties.getTokenUrl(),
                    HttpMethod.POST,
                    request,
                    (Class<Map<String, Object>>) (Class<?>) Map.class
            );

            Map<String, Object> responseBody = response.getBody();
            cachedToken = (String) responseBody.get("access_token");
            int expiresIn = (int) responseBody.get("expires_in");
            // 만료 시각에서 마진을 빼서 안전하게 갱신
            tokenExpiry = Instant.now().plusSeconds(expiresIn - EXPIRY_MARGIN_SECONDS);

            return cachedToken;
        } catch (RestClientException e) {
            log.error("Spotify 토큰 발급 실패", e);
            throw new CustomException(ErrorCode.EXTERNAL_API_ERROR);
        }
    }
}
