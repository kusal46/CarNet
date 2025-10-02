package com.carenet.backend.auth;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Binds properties under "app.jwt.*".
 *
 * Do NOT annotate with @Component (to avoid duplicate beans). Make sure your
 * application enables configuration properties scanning (Spring Boot 3 does by
 * default if you added @ConfigurationPropertiesScan in your main application).
 */
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    /**
     * "iss" claim value. Example: care-net
     */
    private String issuer = "care-net";

    /**
     * Base64-encoded HMAC secret (>= 256 bits AFTER decoding).
     */
    private String secret;

    /**
     * Token time-to-live. Spring can parse "2h", "30m", etc.
     */
    private Duration ttl = Duration.ofHours(2);

    // ----- getters & setters -----

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public Duration getTtl() {
        return ttl;
    }

    public void setTtl(Duration ttl) {
        this.ttl = ttl;
    }
}
