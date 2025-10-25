// backend/src/main/java/NeonSquare/backend/config/SecurityConfig.java
package NeonSquare.backend.config;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Hackathon-friendly security:
 * - CORS enabled (reads allowed origins from property/env)
 * - CSRF disabled (stateless API)
 * - All routes permitted by default (open API)
 *
 * Env/Property mapping:
 *   CORS_ALLOWED_ORIGINS="https://*.vercel.app,http://localhost:3000"
 * binds to Spring property "cors.allowed-origins"
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Comes from env var CORS_ALLOWED_ORIGINS → property cors.allowed-origins
    @Value("${cors.allowed-origins:*}")
    private String allowedOriginsCsv;

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Present for future use; not used when all routes are permitted.
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CORS & CSRF
            .cors(c -> c.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)

            // Fully stateless API (no sessions)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Open everything for the hackathon; tighten later if you add auth
            .authorizeHttpRequests(auth -> auth
                // allow preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // public endpoints
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/api/images/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                // everything else
                .anyRequest().permitAll()
            )

            // Avoid default basic/form login and the "generated password" log
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        List<String> origins = Arrays.stream(allowedOriginsCsv.split(","))
                                     .map(String::trim)
                                     .filter(s -> !s.isBlank())
                                     .collect(Collectors.toList());

        CorsConfiguration cfg = new CorsConfiguration();
        // Support wildcard patterns like https://*.vercel.app
        cfg.setAllowedOriginPatterns(origins.isEmpty() ? List.of("*") : origins);
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setExposedHeaders(List.of("Location", "Content-Disposition"));
        cfg.setAllowCredentials(true);
        cfg.setMaxAge(3600L); // cache preflight for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
