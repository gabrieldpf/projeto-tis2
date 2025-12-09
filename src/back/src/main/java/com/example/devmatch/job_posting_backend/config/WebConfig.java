package com.example.devmatch.job_posting_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração global de CORS para permitir requisições do frontend
 * Essa configuração é necessária para que o frontend possa fazer requisições
 * para o backend que está em uma porta diferente
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:3000",     // React padrão
                    "http://localhost:5173",     // Vite padrão
                    "http://localhost:49393"     // Porta atual do Vite
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // Cache da configuração CORS por 1 hora
    }
}

