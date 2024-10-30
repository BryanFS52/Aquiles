package com.senacsf.aquiles.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.senacsf.aquiles.app.business.ExcusesBusiness;
import com.senacsf.aquiles.app.dto.ExcusesDto;

@RestController
@RequestMapping("/api/excuses")
public class ExcusesController {

    @Autowired
    private ExcusesBusiness excusesBusiness;

    @GetMapping("/all")
    public List<ExcusesDto> getAllExcuses(){
        return excusesBusiness.findAll();
    }

    @PostMapping("/create")
    public void createExcuse(@RequestBody ExcusesDto excusesDto) {
        excusesBusiness.create(excusesDto);
    }

    @PutMapping("/update")
    public void updateExcuse(@RequestBody ExcusesDto excusesDto) {
        excusesBusiness.update(excusesDto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteExcuse(@PathVariable("id") Long excuseId){
        excusesBusiness.delete(excuseId);
    }
}