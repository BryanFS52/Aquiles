package com.senacsf.aquiles.app.service;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class OlimpoService {

    private final RestTemplate restTemplate;

    public OlimpoService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<String> loginToOlimpo() {
        // URL del endpoint de login en Olimpo
        String olimpoUrl = "https://localhost:8081/api/auth/login";

        // Cuerpo de la solicitud JSON
        String requestBody = "{\"documentType\": \"CC\", \"documentNumber\": \"80119962\", \"password\": \"fabrica2023\"}";

        // Configurar headers para la solicitud
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Crear la entidad de la solicitud
        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        // Enviar la solicitud POST a Olimpo
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(olimpoUrl, requestEntity, String.class);

        return responseEntity;
    }
}
