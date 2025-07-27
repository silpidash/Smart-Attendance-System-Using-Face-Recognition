package com.cws.sam.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allow CORS on all endpoints
                .allowedOrigins("http://localhost:8080") // specify allowed origins
                .allowedMethods("GET", "POST", "PUT", "DELETE") // specify allowed methods
                .allowedHeaders("*") // allow any headers
                .allowCredentials(true); // allow credentials (cookies, authorization headers)
    }
}
