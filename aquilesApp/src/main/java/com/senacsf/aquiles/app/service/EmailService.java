package com.senacsf.aquiles.app.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        // Crear el mensaje de correo
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to); // Establece el destinatario
        helper.setSubject(subject); // Establece el asunto
        helper.setText(htmlContent, true); // Establece el contenido HTML

        // Enviar el correo
        emailSender.send(message);
    }

    public void sendEmail(String email, String code) {

    }
}
