package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.dto.LoginRequestDto;
import com.senacsf.aquiles.app.dto.LoginResponseDto;
import com.senacsf.aquiles.app.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final AuthService authService;

    public LoginController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
        LoginResponseDto response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(response);
    }
}
