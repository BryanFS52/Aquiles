package com.senacsf.aquiles.app.controller;
import com.senacsf.aquiles.app.service.OlimpoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AquilesController {

    private final OlimpoService olimpoService;

    public AquilesController(OlimpoService olimpoService) {
        this.olimpoService = olimpoService;
    }

    @GetMapping("/login-to-olimpo")
    public ResponseEntity<String> loginToOlimpo() {
        return olimpoService.loginToOlimpo();
    }
}
