package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.dto.LoginRequestDto;
import com.senacsf.aquiles.app.dto.LoginResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AuthService {

    @Autowired
    private RestTemplate restTemplate;

    public LoginResponseDto authenticate(LoginRequestDto loginRequestDto) throws Exception {
        String url = "https://localhost:8081/api/auth/login"; // URL del microservicio Olimpo
        try {
            return restTemplate.postForObject(url, loginRequestDto, LoginResponseDto.class);
        } catch (Exception e) {
            throw new Exception("Authentication failed: " + e.getMessage());
        }
    }
}
