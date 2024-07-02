package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.dto.LoginRequestDto;
import com.senacsf.aquiles.app.dto.LoginResponseDto;
import com.senacsf.aquiles.app.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
        try {
            LoginResponseDto response = authService.authenticate(loginRequestDto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Authentication failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body(null);
        }
    }
}
