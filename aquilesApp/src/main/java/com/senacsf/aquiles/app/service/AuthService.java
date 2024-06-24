package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.dto.LoginRequestDto;
import com.senacsf.aquiles.app.dto.LoginResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AuthService {

    private final RestTemplate restTemplate;
    private final String olimpoAuthUrl;

    public AuthService(RestTemplate restTemplate, @Value("${olimpo.auth.url}") String olimpoAuthUrl) {
        this.restTemplate = restTemplate;
        this.olimpoAuthUrl = olimpoAuthUrl;
    }

    public LoginResponseDto authenticate(LoginRequestDto loginRequest) {
        return restTemplate.postForObject(olimpoAuthUrl, loginRequest, LoginResponseDto.class);
    }
}

