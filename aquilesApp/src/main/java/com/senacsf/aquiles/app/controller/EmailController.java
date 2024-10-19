package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.request.EmailRequest;
import com.senacsf.aquiles.app.service.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class EmailController {
    @Autowired
    private EmailService emailService;

    @PostMapping("/send-notification")
    public String sendNotification(@RequestBody EmailRequest emailRequest) {
        try {
            emailService.sendHtmlEmail(emailRequest.getEmail(), emailRequest.getSubject(), emailRequest.getHtmlContent());
            return "Correo enviado con éxito";
        } catch (MessagingException e) {
            e.printStackTrace();
            return "Error al enviar el correo";
        }
    }
}