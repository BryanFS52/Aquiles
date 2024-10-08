package com.senacsf.aquiles.app.business;

import com.senacsf.aquiles.app.dto.TeamsScrumDto;
import com.senacsf.aquiles.app.dto.stateAttedanceDto;
import com.senacsf.aquiles.app.entities.Teams_scrum;
import com.senacsf.aquiles.app.entities.stateAttendance;
import com.senacsf.aquiles.app.service.stateAttendanceService;
import com.senacsf.aquiles.app.utilities.CustomException;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class stateAttendanceBusiness {
    @Autowired
    private stateAttendanceService stateAttendanceService;

    private final ModelMapper modelMapper = new ModelMapper();

    public List<stateAttedanceDto> findAll() {
        try {
            List<stateAttendance> stateAttendanceList = stateAttendanceService.findAll();
            if (stateAttendanceList.isEmpty()) {
                return new ArrayList<>();
                }
            List<stateAttedanceDto> stateAttendanceDtoList = new ArrayList<>();
            stateAttendanceList.forEach(stateAttendance -> stateAttendanceDtoList.add(modelMapper.map(stateAttendance, stateAttedanceDto.class)));
            return stateAttendanceDtoList;
        } catch (Exception e) {
            throw new CustomException("Error getting state");
        }
    }

    public stateAttedanceDto findById(Long id){
        try {
            stateAttendance stateAttendance = stateAttendanceService.getById(id);
            if (stateAttendance != null) {
                return modelMapper.map(stateAttendance, stateAttedanceDto.class);
            } else {
                throw new CustomException("Not found state attendance with that id");
            }
        } catch (EntityNotFoundException e) {
            throw new CustomException("Not found state attendace with that id");
        }
    }

    public boolean createStateAttendance(stateAttedanceDto stateAttedanceDto){
        try {
            stateAttendance stateAttendance = modelMapper.map(stateAttedanceDto, stateAttendance.class);
            stateAttendanceService.create(stateAttendance);
            return true;
        } catch (Exception e) {
            throw new CustomException("Error creating state attendance");
        }
    }

    public boolean updateStateAttendance(stateAttedanceDto stateAttedanceDto){
        try {
            if (stateAttedanceDto.getStateAttendanceId() == null){
                throw new CustomException("Not update state attendance because the id is null");
            }

            stateAttendance existingStateAttendance = stateAttendanceService.getById(stateAttedanceDto.getStateAttendanceId());

            stateAttendance updatedStateAttendance = modelMapper.map(stateAttedanceDto, stateAttendance.class);
            stateAttendanceService.create(updatedStateAttendance);
            return true;
        } catch (EntityNotFoundException e){
            throw new CustomException("The state attendance you are trying to update is not registered");
        } catch (Exception e) {
            throw new CustomException("Error update state attendance");
        }
    }

    public boolean deleteStateAttendance(Long id){
        try {
            if (id == null){
                throw new CustomException("Not delete state attendance because the id is null");
            }

            stateAttendance deletingStateAttendance = stateAttendanceService.getById(id);
            stateAttendanceService.delete(deletingStateAttendance);
            return true;
        } catch (EntityNotFoundException e) {
            throw new CustomException("Not delete state attendance because the id is null");
        } catch (Exception e) {
            throw new CustomException("Error delete state attendance");
        }
    }


}
