package com.senacsf.aquiles.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration // Indica que esta clase es una clase de configuración de Spring
@EnableWebSecurity // Habilita la seguridad web en la aplicación Spring
public class SecurityConfig {

    @Bean // Declara un bean de Spring
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF solo para desarrollo
//                .csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()) // Configura CSRF con un repositorio de tokens CSRF basado en cookies que permite acceso a través de JavaScript
//                .and() // Concatena configuraciones adicionales
                .authorizeHttpRequests(authorizeRequests -> // Configura la autorización de las solicitudes HTTP
                        authorizeRequests
                                .requestMatchers("/api/teams-scrum/all").permitAll() // Permite acceso sin autenticación a este endpoint
                                .requestMatchers("/api/teams-scrum/create").permitAll() // Permite acceso sin autenticación a este endpoint
                                .requestMatchers("/api/teams-scrum/update").permitAll() // Permite acceso sin autenticación a este endpoint
                                .requestMatchers("/api/teams-scrum/delete/{id}").permitAll() // Permite acceso sin autenticación a este endpoint
                                .requestMatchers("/api/send-notification").permitAll()
                                .requestMatchers("/api/2fa/**").permitAll()
                                .requestMatchers("/api/pdf/report").permitAll()
                                .requestMatchers("/api/attendances/generateQRCode").permitAll()
                                .requestMatchers("/api/excel/report").permitAll()
                                .requestMatchers("/api/projects/**").permitAll()
                                .requestMatchers("/api/students/**").permitAll()
                                .requestMatchers("/api/trainers/**").permitAll()



                                .anyRequest().authenticated() // Requiere autenticación para cualquier otra solicitud
                );
        return http.build(); // Construye el objeto SecurityFilterChain
    }

    @Bean // Declara un bean de Spring
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Proporciona una implementación de codificación de contraseñas basada en BCrypt
    }
}