package com.senacsf.aquiles.app.controller;

import com.senacsf.aquiles.app.business.stateAttendanceBusiness;
import com.senacsf.aquiles.app.dto.stateAttedanceDto;
import com.senacsf.aquiles.app.utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/stateattendance")
public class StateAttenanceController {

    @Autowired
    private stateAttendanceBusiness stateAttendanceBusiness;

    @GetMapping("/all")
        public ResponseEntity<List<stateAttedanceDto>> getallstateAttendance(){
        List<stateAttedanceDto> stateAttedanceList = stateAttendanceBusiness.findAll();

        if (stateAttedanceList.isEmpty()){
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(stateAttedanceList);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getstateAttendanceById(@PathVariable Long id){
        try {
            stateAttedanceDto stateAttedance = stateAttendanceBusiness.findById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("data", stateAttedance);
            response.put("code", 200);
            return ResponseEntity.ok(response);
        } catch (CustomException e){
            return handleException (e);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createstateAttendance(@Validated @RequestBody stateAttedanceDto stateAttedanceDto){
        try{
            stateAttendanceBusiness.createStateAttendance(stateAttedanceDto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "state Attendance created successfully");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (CustomException e){
            return handleException (e);
        }
    }

    @PutMapping("/update")
    public  ResponseEntity<Map<String, Object>> updatestateAttendance(@Validated @RequestBody stateAttedanceDto stateAttedanceDto){
        try {
            stateAttendanceBusiness.updateStateAttendance(stateAttedanceDto);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "state Attendance updated successfully");
            return  ResponseEntity.ok(response);
        } catch (CustomException e){
            return handleException (e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deletestateAttendance (@PathVariable Long id){
        try {
            stateAttendanceBusiness.deleteStateAttendance(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "state Attendance deleted successfully");
            return ResponseEntity.ok(response);
        } catch (CustomException e){
            return handleException (e);
        }
    }

    private ResponseEntity<Map<String, Object>> handleException (CustomException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", e.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);

    }
}
