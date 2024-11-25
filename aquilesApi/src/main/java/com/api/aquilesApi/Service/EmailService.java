package com.api.aquilesApi.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

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
        FileSystemResource res = new FileSystemResource(new File("/home/fabrica/aquilesApp/frontend/public/img/Logo-sena-green.png"));
        helper.addInline("logoImage", res);

        // Enviar el correo
        emailSender.send(message);
    }

    public void sendEmail(String email, String code) {

    }

}
