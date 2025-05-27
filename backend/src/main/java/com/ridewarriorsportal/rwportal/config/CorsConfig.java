package com.ridewarriorsportal.rwportal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedMethods("*").allowedHeaders("*")
                .allowedOrigins("http://localhost:5173", "https://ridewarriors-2552b.web.app")
                .allowCredentials(true);
    }
}


