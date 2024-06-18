package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.business.ExcusesBusiness;
import com.senacsf.aquiles.app.dto.ExcusesDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public void createExcuses(@RequestBody ExcusesDto excusesDto) {
        excusesBusiness.create(excusesDto);
    }

    @PutMapping("/update")
    public void updateExxcuse(@RequestBody ExcusesDto excusesDto) {
        excusesBusiness.update(excusesDto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteExcuse(@PathVariable("id") Long excuseId){
        excusesBusiness.delete(excuseId);
    }
}
