package com.senacsf.aquiles.app.controller;

import com.google.zxing.WriterException;
import com.senacsf.aquiles.app.business.AttendancesBusiness;
import com.senacsf.aquiles.app.dto.AttenancesDto;
import com.senacsf.aquiles.app.utilities.QrCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

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
    public void updateAttendance(@RequestBody AttenancesDto attenancesDto) {
        attendancesBusiness.update(attenancesDto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteAttendance(@PathVariable("id") Long attendanceId) {
        attendancesBusiness.delete(attendanceId);
    }

    @Autowired
    private QrCodeGenerator qrCodeGenerator;

    @GetMapping("/generateQRCode")
    public ResponseEntity<byte[]> generateQRCode() {
        try {
            String frontendUrl = "https://4bc6-152-200-176-22.ngrok-free.app/qrformulariomovil";
            byte[] qrCode = qrCodeGenerator.generateQRCodeImage(frontendUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "image/png");
            return new ResponseEntity<>(qrCode, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
<<<<<<< HEAD
    //probando commit para merge
    @GetMapping("/summary/{trainerId}")
    public ResponseEntity<Map<String, Long>> getAttendanceSummary(@PathVariable Long trainer_id) {
        Map<String, Long> summary = attendancesBusiness.getAttendanceSummary(trainer_id);
        return ResponseEntity.ok(summary);
    }
=======

>>>>>>> 0840835b7f0aedd7c7b1ce3d75191bbbc9288449
}