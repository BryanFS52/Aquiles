package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.business.DiarySustainationsBusiness;
import com.senacsf.aquiles.app.dto.DiarySustainationsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
    @RequestMapping("/api/diary-sustainations")
public class DiarySustainationsController  {
    @Autowired
    private DiarySustainationsBusiness diarySustainationsBusiness;

    @GetMapping("/all")
    public List<DiarySustainationsDto> getAllDiarySustainations(){
        return diarySustainationsBusiness.findAll();
    }

    @PostMapping("/create")
    public void createDiarySustainations(@RequestBody DiarySustainationsDto diarySustainationsDto) {
        diarySustainationsBusiness.create(diarySustainationsDto);
    }

    @PutMapping("/update")
    public void updateDiarySustainations(@RequestBody DiarySustainationsDto diarySustainationsDto){
        diarySustainationsBusiness.update(diarySustainationsDto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteDiarySustainations(@PathVariable("id") Long diarySustainationsId){
        diarySustainationsBusiness.delete(diarySustainationsId);
    }
}
