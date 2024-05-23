package com.senacsf.aquiles.app.business;

import com.senacsf.aquiles.app.dto.ExcusesDto;
import com.senacsf.aquiles.app.dto.TeamsScrumDto;
import com.senacsf.aquiles.app.entities.Excuses;
import com.senacsf.aquiles.app.entities.Teams_scrum;
import com.senacsf.aquiles.app.service.ExcusesService;
import com.senacsf.aquiles.app.utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ExcusesBusiness {

    @Autowired
    private ExcusesService excusesService;

    private final ModelMapper modelMapper =  new ModelMapper();

    public List<ExcusesDto> findAll() {
        try {
            List<Excuses> excusesList = excusesService.findAll();
            if (excusesList.isEmpty()) {
                return new ArrayList<>();
            }
            List<ExcusesDto> excusesDtoList = new ArrayList<>();

            excusesList.forEach(excuses -> excusesDtoList.add(modelMapper.map(excuses, ExcusesDto.class)));
            return excusesDtoList;
        } catch (Exception e) {
            throw new CustomException("Error getting teams scrum");
        }
    }

    public void update(ExcusesDto excusesDto) {
        try {
            Excuses excuses = modelMapper.map(excusesDto, Excuses.class);
            excusesService.save(excuses);
        } catch (Exception e) {
            throw new CustomException("Error saving Excuse");
        }
    }

    public void create(ExcusesDto excusesDto) {
        try {
            Excuses excuses = modelMapper.map(excusesDto, Excuses.class);
            excusesService.save(excuses);
        } catch (Exception e) {
            throw new CustomException("Error al guardar");
        }
    }

    public void delete(Long excusesId) {
        try {
            Excuses excuses = excusesService.getById(excusesId);
            if (excuses == null) {
                throw new CustomException("Excuse with id " + excusesId + " not found");
            }
            excusesService.delete(excuses);
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}