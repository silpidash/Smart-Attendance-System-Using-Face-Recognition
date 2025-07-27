package com.cws.sam.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(
                        new Info().title("Smart Attendance Management Service")
                                .description("A Spring Boot Web Application For Attendance Management By Using Facial Recognition")
                )
                .servers(
                        List.of(new Server().url("http://localhost:8081").description("local"),
                                new Server().url("http://localhost:8081").description("dev"))
                );
    }

}
