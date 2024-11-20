package com.api.aquilesApi.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF solo para desarrollo (no recomendado en producción)
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                // Permitir acceso sin autenticación a los endpoints específicos
                                .requestMatchers("/api/teams-scrum/**").permitAll()
                                .requestMatchers("/api/send-notification").permitAll()
                                .requestMatchers("/api/2fa/**").permitAll()
                                .requestMatchers("/api/pdf/**").permitAll()
                                .requestMatchers("/api/excel/**").permitAll()
                                .requestMatchers("/api/projects/**").permitAll()
                                .requestMatchers("/api/students/**").permitAll()  // Permitir acceso sin autenticación a /api/students/**
                                .requestMatchers("/api/trainers/**").permitAll()
                                .requestMatchers("/api/stateAttendance/**").permitAll()
                                .anyRequest().authenticated() // Requiere autenticación para cualquier otra solicitud
                );

        return http.build();
    }
}
