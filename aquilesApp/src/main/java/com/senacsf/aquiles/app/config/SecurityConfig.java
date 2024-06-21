package com.senacsf.aquiles.app.config;

import org.springframework.context.annotation.Bean; // Importa la anotación @Bean para definir beans en Spring
import org.springframework.context.annotation.Configuration; // Importa la anotación @Configuration para definir una clase de configuración
import org.springframework.security.config.annotation.web.builders.HttpSecurity; // Importa HttpSecurity para configurar la seguridad web
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // Importa @EnableWebSecurity para habilitar la seguridad web
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Importa BCryptPasswordEncoder para el cifrado de contraseñas
import org.springframework.security.crypto.password.PasswordEncoder; // Importa la interfaz PasswordEncoder
import org.springframework.security.web.SecurityFilterChain; // Importa SecurityFilterChain para definir la cadena de filtros de seguridad

@Configuration // Marca esta clase como una clase de configuración de Spring
@EnableWebSecurity // Habilita la seguridad web en esta aplicación
public class SecurityConfig {

    @Bean // Define un bean de Spring
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilita la protección CSRF (Cross-Site Request Forgery), recomendado solo para desarrollo
                .authorizeHttpRequests(authorizeRequests -> // Configura la autorización de solicitudes HTTP
                        authorizeRequests
                                .requestMatchers("/api/auth/login").permitAll() // Permite acceso sin autenticación al endpoint de login
                                .requestMatchers("/api/teams-scrum/all").permitAll() // Permite acceso sin autenticación al endpoint para obtener todos los equipos scrum
                                .requestMatchers("/api/teams-scrum/create").permitAll() // Permite acceso sin autenticación al endpoint para crear equipos scrum
                                .requestMatchers("/api/teams-scrum/update").permitAll() // Permitir acceso sin autenticación a este endpoint para actualizar equipos scrum
                                .requestMatchers("/api/teams-scrum/delete/{id}").permitAll() // Permitir acceso sin autenticación a este endpoint para eliminar equipos scrum
                                .anyRequest().authenticated() // Requiere autenticación para cualquier otra solicitud
                );
        return http.build(); // Construye y devuelve la cadena de filtros de seguridad configurada
    }

    @Bean // Define un bean de Spring
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Retorna un BCryptPasswordEncoder para cifrar contraseñas
    }
}
