package com.senacsf.aquiles.app.business;

import com.senacsf.aquiles.app.dto.AttenancesDto;
import com.senacsf.aquiles.app.entities.Attendances;
import com.senacsf.aquiles.app.service.AttendancesService;
import com.senacsf.aquiles.app.utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class AttendancesBusiness {

    @Autowired
    private AttendancesService attendancesService;

    private final ModelMapper modelMapper = new ModelMapper();

    public List<AttenancesDto> findAll() {
        try {
            List<Attendances> attendancesList = attendancesService.findAll();
            if (attendancesList.isEmpty()) {
                return new ArrayList<>();
            }
            List<AttenancesDto> attenancesDtoList = new ArrayList<>();
            attendancesList.forEach(attendances -> attenancesDtoList.add(modelMapper.map(attendances, AttenancesDto.class)));
            return attenancesDtoList;
        } catch (Exception e) {
            throw new CustomException("Error getting teams scrum");
        }
    }

    public void update(AttenancesDto attenancesDto) {
        try {
            Attendances attendances = modelMapper.map(attenancesDto, Attendances.class);
            attendancesService.save(attendances);
        } catch (Exception e) {
            throw new CustomException("Error saving teams scrum");
        }
    }

    public void create(AttenancesDto attenancesDto) {
        try {
            Attendances attendances = modelMapper.map(attenancesDto, Attendances.class);
            attendancesService.save(attendances);
        } catch (Exception e) {
            throw new CustomException("Error al guardar");
        }
    }

    public void delete(Long attendanceId) {
        try {
            Attendances attendances = attendancesService.getById(attendanceId);
            if (attendances == null) {
                throw new CustomException("attendance with id " + attendanceId + " not found");
            }
            attendancesService.delete(attendances);
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }

    public Map<String, Long> getAttendanceSummary(Long trainer_id) {
        try {
            long presentCount = attendancesService.countPresentByTrainerId(trainer_id);
            long absentCount = attendancesService.countAbsentByTrainerId(trainer_id);

            Map<String, Long> summary = new HashMap<>();
            summary.put("present", presentCount);
            summary.put("absent", absentCount);

            return summary;
        } catch (Exception e) {
            throw new CustomException("Error getting attendance summary");
        }
    }
}