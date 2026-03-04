package com.api.aquilesApi.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailService {
    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        if (!StringUtils.hasText(to) || !StringUtils.hasText(subject) || !StringUtils.hasText(htmlContent)) {
            throw new IllegalArgumentException("Los campos email, asunto y contenido son obligatorios");
        }

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            // Intentar cargar el logo desde los recursos
            try {
                ClassPathResource logoResource = new ClassPathResource("static/img/Logo-sena-green.png");
                if (logoResource.exists()) {
                    helper.addInline("logoImage", logoResource);
                }
            } catch (Exception e) {
                // Si no se puede cargar el logo, continuar sin él
                System.out.println("No se pudo cargar el logo: " + e.getMessage());
            }

            emailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Error al enviar el correo: " + e.getMessage());
            throw e;
        }
    }

    public void sendEmail(String email, String code) {
        // Implementación pendiente
    }
}
