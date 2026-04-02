package com.musicjournal.musicjournal.spotify;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "spotify")
public class SpotifyProperties {

    private String clientId;        // spotify.client-id
    private String clientSecret;    // spotify.client-secret
    private String tokenUrl;        // spotify.token-url
    private String apiBaseUrl;      // spotify.api-base-url
}
