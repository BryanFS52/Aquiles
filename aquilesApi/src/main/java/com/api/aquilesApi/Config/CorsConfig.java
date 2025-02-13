package com.api.aquilesApi.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("**") // Permitir solicitudes desde tu frontend en el puerto 3000
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Permitir métodos HTTP específicos
                .allowedHeaders("*") // Permitir todos los encabezados
                .allowCredentials(true); // Permitir credenciales (cookies, tokens, etc.)x
    }
}
