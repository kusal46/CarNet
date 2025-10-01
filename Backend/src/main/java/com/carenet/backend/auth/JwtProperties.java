package com.carenet.backend.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
  /** Base64-encoded 256-bit secret */
    private String secret;
    /** Token expiry in minutes */
    private long expMin = 120;

    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }

    public long getExpMin() { return expMin; }
    public void setExpMin(long expMin) { this.expMin = expMin; }
}
