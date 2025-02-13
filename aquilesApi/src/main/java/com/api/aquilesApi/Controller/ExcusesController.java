package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.ExcusesBusiness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/excuse")
public class ExcusesController {

    @Autowired
    private ExcusesBusiness excusesBusiness;

    //@GetMapping("/all")


}