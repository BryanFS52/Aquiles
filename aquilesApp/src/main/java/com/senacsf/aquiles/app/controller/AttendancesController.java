package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.business.AttendancesBusiness;
import com.senacsf.aquiles.app.dto.AttenancesDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendances")
public class AttendancesController {

    @Autowired
    private AttendancesBusiness attendancesBusiness;

    @GetMapping("/all")
    public List<AttenancesDto> getAllAttendances() {
        return attendancesBusiness.findAll();
    }

    @PostMapping("/create")
    public void createAttendance(@RequestBody AttenancesDto attenancesDto) {
        attendancesBusiness.create(attenancesDto);
    }

    @PutMapping("/update")
    public void updateAttendance(@RequestBody AttenancesDto attenancesDto){
        attendancesBusiness.update(attenancesDto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteAttendance(@PathVariable("id") Long attendanceId){
        attendancesBusiness.delete(attendanceId);
    }
}