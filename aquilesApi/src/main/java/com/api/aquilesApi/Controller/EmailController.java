package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Service.EmailService;
import com.api.aquilesApi.Utilities.EmailRequest;
import jakarta.mail.MessagingException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

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

    @RequestMapping(value = "/send-notification", method = RequestMethod.OPTIONS)
    public void handleOptions() {
        // Este método maneja las peticiones OPTIONS
    }
}