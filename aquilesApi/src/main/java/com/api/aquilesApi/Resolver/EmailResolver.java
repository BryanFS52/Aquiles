package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Service.EmailService;
import com.api.aquilesApi.Utilities.EmailRequest;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import jakarta.mail.MessagingException;

@DgsComponent
public class EmailResolver {

    private final EmailService emailService;

    public EmailResolver(EmailService emailService) {
        this.emailService = emailService;
    }

    @DgsMutation
    public String sendNotification(@InputArgument EmailRequest emailRequest) {
        try {
            emailService.sendHtmlEmail(
                    emailRequest.getEmail(),
                    emailRequest.getSubject(),
                    emailRequest.getHtmlContent()
            );
            return "Correo enviado con éxito";
        } catch (MessagingException e) {
            e.printStackTrace();
            return "Error al enviar el correo";
        }
    }
}