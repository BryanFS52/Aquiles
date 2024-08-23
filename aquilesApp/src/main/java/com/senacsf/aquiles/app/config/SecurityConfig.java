package com.senacsf.aquiles.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF para desarrollo
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
<<<<<<< HEAD
                                .anyRequest().permitAll() // Permitir todas las solicitudes sin autenticación
=======
                                .requestMatchers("/api/send-notification").permitAll() // Permitir acceso sin autenticación a este endpoint
                                .requestMatchers("/api/teams-scrum/all").permitAll()
                                .requestMatchers("/api/teams-scrum/create").permitAll()
                                .requestMatchers("/api/teams-scrum/update").permitAll()
                                .requestMatchers("/api/teams-scrum/delete/{id}").permitAll()
                                .anyRequest().authenticated() // Requerir autenticación para cualquier otra solicitud
>>>>>>> 8735888 (cambios en los archivos security config y EmailController)
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Codificación de contraseñas con BCrypt
    }
}
