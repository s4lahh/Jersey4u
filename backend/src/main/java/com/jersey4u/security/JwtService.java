package com.jersey4u.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // Minimum 256-bit secret key fallback for HMAC-SHA256
    private static final String DEFAULT_SECRET = "Jersey4UTheFootballVaultUltraSecureJwtSigningKey2026Minimum256BitsRequired!";

    private final SecretKey signingKey;
    private final long jwtExpirationMs;

    public JwtService(
            @Value("${jwt.secret:}") String configuredSecret,
            @Value("${jwt.expiration-ms:86400000}") long jwtExpirationMs // 24 hours default
    ) {
        String effectiveSecret = (configuredSecret != null && configuredSecret.trim().length() >= 32)
                ? configuredSecret.trim()
                : DEFAULT_SECRET;
        this.signingKey = Keys.hmacShaKeyFor(effectiveSecret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationMs = jwtExpirationMs;
    }

    public String generateToken(String email, String name, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", name);
        claims.put("role", role);

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractName(String token) {
        return extractAllClaims(token).get("name", String.class);
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public boolean isTokenValid(String token, String userEmail) {
        final String email = extractEmail(token);
        return (email.equalsIgnoreCase(userEmail)) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
