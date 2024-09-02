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
                                // Solo instructores pueden acceder a los endpoints de asistencia
                                .requestMatchers("/attendance/**").hasRole("Trainer")
                                // Cualquier otra solicitud requiere autenticación
                                .anyRequest().authenticated()
                )
                .formLogin(form ->
                        form
                                .loginPage("/login") // Personaliza la página de inicio de sesión
                                .permitAll()
                )
                .logout(logout ->
                        logout.permitAll()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Codificador de contraseñas BCrypt
    }
}
