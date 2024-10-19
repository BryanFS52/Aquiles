package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.service.EmailService;
import com.senacsf.aquiles.app.service.TwoFactorAuthService;
import com.senacsf.aquiles.app.utilities.CodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/2fa")
public class TwoFactorAuthController {

    @Autowired
    private TwoFactorAuthService twoFactorAuthService;

    @Autowired
    EmailService emailService;

    @PostMapping("/generatecode")
    public ResponseEntity<String> generateCode(@RequestParam String email) {
        try {
            twoFactorAuthService.generateAndSendCode(email);
            return ResponseEntity.ok("2FA code sent to email.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending 2FA code.");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyCode(@RequestParam String email, @RequestParam String code) {
        if (twoFactorAuthService.verifyCode(email, code)) {
            return ResponseEntity.ok("2FA code verified successfully.");
        } else {
            return ResponseEntity.status(400).body("Invalid or expired 2FA code.");
        }
    }
}