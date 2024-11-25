package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.JustificationBusiness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/justification")
public class JustificationController {

    @Autowired
    private JustificationBusiness justificationBusiness;

    // @GetMapping("/all")
    // Implementa los métodos necesarios aquí
}
