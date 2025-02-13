package com.api.aquilesApi.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF solo para desarrollo
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                // Permitir acceso sin autenticación a los endpoints específicos
                                .requestMatchers("/api/teams-scrum/**").permitAll()
                                .requestMatchers("/api/send-notification").permitAll()
                                .requestMatchers("/api/2fa/**").permitAll()
                                .requestMatchers("/api/pdf/**").permitAll()
                                .requestMatchers("/api/attendances/**").permitAll()
                                .requestMatchers("/api/excel/**").permitAll()
                                .requestMatchers("/api/projects/**").permitAll()
                                .requestMatchers("/api/students/**").permitAll()
                                .requestMatchers("/api/trainers/**").permitAll()
                                .requestMatchers("/api/stateAttendance/**").permitAll()
                                // Cualquier otra solicitud requiere autenticación
                                .anyRequest().permitAll() // Permitir todas las demás solicitudes sin autenticación
                );

        return http.build();
    }
}


