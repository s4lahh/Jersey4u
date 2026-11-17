package com.jersey4u.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow all CORS preflight OPTIONS requests unconditionally
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public Authentication Endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Public Jersey Catalog (Anyone can browse)
                .requestMatchers(HttpMethod.GET, "/api/jerseys/**").permitAll()

                // Checkout & Order Placement (Can be guest or logged-in)
                .requestMatchers(HttpMethod.POST, "/api/orders", "/api/orders/razorpay/**", "/api/orders/*/pay").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/orders/{orderCode}").permitAll()

                // Protected User Endpoints (Requires valid JWT)
                .requestMatchers("/api/orders/my-orders").authenticated()
                .requestMatchers("/api/auth/me").authenticated()

                // Admin Capabilities (Requires ROLE_ADMIN in JWT)
                .requestMatchers(HttpMethod.POST, "/api/jerseys/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/jerseys/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/jerseys/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/jerseys/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/orders/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/orders").hasRole("ADMIN")

                // Default: allow remaining read-only or static routes
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:3000"
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
