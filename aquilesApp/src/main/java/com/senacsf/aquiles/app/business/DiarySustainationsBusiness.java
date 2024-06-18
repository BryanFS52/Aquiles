package com.senacsf.aquiles.app.business;

import com.senacsf.aquiles.app.dto.DiarySustainationsDto;
import com.senacsf.aquiles.app.dto.TeamsScrumDto;
import com.senacsf.aquiles.app.entities.DiarySustainations;
import com.senacsf.aquiles.app.entities.Teams_scrum;
import com.senacsf.aquiles.app.service.DiarySustainationsService;
import com.senacsf.aquiles.app.utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DiarySustainationsBusiness {

    @Autowired
    private DiarySustainationsService diarySustainationsService;

    private final ModelMapper modelMapper = new ModelMapper();


    public List<DiarySustainationsDto> findAll() {
        try {
            List<DiarySustainations> diarySustainationsList = diarySustainationsService.findAll();
            if (diarySustainationsList.isEmpty()) {
                return new ArrayList<>();
            }
            List<DiarySustainationsDto> diarySustainationsDtoList = new ArrayList<>();
            diarySustainationsList.forEach(diarySustainations -> diarySustainationsDtoList.add(modelMapper.map(diarySustainations, DiarySustainationsDto.class)));
            return diarySustainationsDtoList;
        } catch (Exception e) {
            throw new CustomException("Error getting teams scrum");
        }
    }

    public void update(DiarySustainationsDto diarySustainationsDto) {
        try {
            DiarySustainations diarySustainations = modelMapper.map(diarySustainationsDto, DiarySustainations.class);
            diarySustainationsService.save(diarySustainations);
        } catch (Exception e) {
            throw new CustomException("Error saving teams scrum");
        }
    }

    public void create(DiarySustainationsDto diarySustainationsDto) {
        try {
            DiarySustainations diarySustainations = modelMapper.map(diarySustainationsDto, DiarySustainations.class);
            diarySustainationsService.save(diarySustainations);
        } catch (Exception e) {
            throw new CustomException("Error creating Teams Scrum");
        }
    }

    public void delete(Long diarySustainationsId) {
        try {
            DiarySustainations diarySustainations = diarySustainationsService.getById(diarySustainationsId);
            if (diarySustainations == null) {
                throw new CustomException("diary sustainations with id " + diarySustainationsId + " not found");
            }
            diarySustainationsService.delete(diarySustainations);
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}
