package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.service.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class EmailController {
    @Autowired
    private EmailService emailService;

    @GetMapping("/send-notification")
    public String sendNotification(@RequestParam String email) {
        try {
            String subject = "Notificación para la Inasistencia";
            String templateName = "attendanceNotificationTemplate.html";
            emailService.sendAttendanceNotification(email, subject, templateName);
            return "Correo enviado con éxito";
        } catch (IOException | MessagingException e) {
            e.printStackTrace();
            return "Error al enviar el correo";
        }
    }
}