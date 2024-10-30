package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.business.JustificationBusiness;
import com.senacsf.aquiles.app.dto.JustificationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/justifications")
public class JustificationController {

    @Autowired
    private JustificationBusiness justificationBusiness;

    @GetMapping ("/all")
    public List<JustificationDto> getAllJustification(){
        return justificationBusiness.findAll();
    }

    @PostMapping("/create")
    public void createJustification(@RequestBody JustificationDto justificationDto) {

        justificationBusiness.create(justificationDto);
    }

    @PutMapping("/update")
    public void updateJustification(@RequestBody JustificationDto justificationDto) {
        justificationBusiness.update(justificationDto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteJustification(@PathVariable("id") Long justificationId){
        justificationBusiness.delete(justificationId);
    }
}