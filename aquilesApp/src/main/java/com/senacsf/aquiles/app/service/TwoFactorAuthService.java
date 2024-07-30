package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.TwoFactorAuth;
import com.senacsf.aquiles.app.repository.TwoFactorAuthRepository;
import com.senacsf.aquiles.app.utilities.CodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TwoFactorAuthService {

    @Autowired
    private EmailService emailService;

    private Map<String, String> codes = new ConcurrentHashMap<>();

    public void generateAndSendCode(String email) {
        String code = CodeGenerator.generateCode();
        codes.put(email, code);
        emailService.sendEmail(email, code);
    }

    public boolean verifyCode(String email, String code) {
        String storedCode = codes.get(email);
        return storedCode != null && storedCode.equals(code);
    }
}
