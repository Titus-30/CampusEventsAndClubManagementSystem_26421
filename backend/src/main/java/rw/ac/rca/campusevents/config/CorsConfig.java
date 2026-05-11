package rw.ac.rca.campusevents.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CORS Configuration to allow frontend (React) to communicate with backend
 * This enables cross-origin requests from http://localhost:3000 to http://localhost:8080
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        // Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);

        // Allow local frontend servers (any localhost port) during development
        // use addAllowedOriginPattern to support dynamic ports like 3000, 3001, etc.
        config.addAllowedOriginPattern("http://localhost:*");

        // Allow all headers
        config.addAllowedHeader("*");

        // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
        config.addAllowedMethod("*");

        // Allow credentials and apply to all endpoints
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}  


