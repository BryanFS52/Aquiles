package com.senacsf.aquiles.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // Permitir solicitudes desde Aquiles en el puerto 3000
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Permitir métodos GET, POST, PUT y DELETE
                .allowedHeaders("*") // Permitir todos los encabezados
                .allowCredentials(true); // Permitir credenciales (cookies, tokens, etc.)

        // Agregar mapeo específico para el endpoint de login de Olimpo en el puerto 8081
        registry.addMapping("/api/auth/login")
                .allowedOrigins("http://localhost:8080", "http://localhost:8081") // Permitir solicitudes a Olimpo desde Aquiles en el puerto 8080 y 8081
                .allowedMethods("POST") // Permitir solo el método POST
                .allowedHeaders("*") // Permitir todos los encabezados
                .allowCredentials(false); // No requerir credenciales para este endpoint específico
    }
}
