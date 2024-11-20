package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.AttendanceBusiness;
import com.api.aquilesApi.Dto.AttendanceDTO;
import com.api.aquilesApi.Entity.StateAttendance;
import com.api.aquilesApi.Service.AttendanceService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.api.aquilesApi.Utilities.QrCodeGenerator;
import com.google.zxing.WriterException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/attendance", method = {
        RequestMethod.DELETE,
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT
})
public class AttendanceController {

    @Autowired
    private AttendanceBusiness attendanceBusiness;

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private QrCodeGenerator qrCodeGenerator;

    // Endpoint para obtener todas las asistencias
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> findAll(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size) {
        try {
            Page<AttendanceDTO> attendanceDtoPage = attendanceBusiness.findAll(page, size);
            Map<String, Object> response = ResponseHttpApi.responseHttpFindAll(
                    attendanceDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed",
                    attendanceDtoPage.getSize(),
                    attendanceDtoPage.getTotalPages(),
                    (int) attendanceDtoPage.getTotalElements());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error retrieving attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para encontrar asistencia por ID
    @GetMapping("/find/{id}")
    public ResponseEntity<Map<String, Object>> findById(@PathVariable Long id) {
        try {
            AttendanceDTO attendanceDto = this.attendanceBusiness.findById(id);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpFindId(
                    attendanceDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed"),
                    HttpStatus.OK);
        } catch (CustomException e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error getting attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para contar asistencias presentes por trainerId
    @GetMapping("/count/present")
    public ResponseEntity<Map<String, Object>> countPresentByTrainer(@RequestParam Long trainerId,
                                                                     @RequestParam Long presentStateId) {
        try {
            long count = attendanceService.countPresentByTrainerId(trainerId, presentStateId);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK,
                    "Count retrieved: " + count),
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error counting present attendances: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para verificar si existe asistencia con fecha y estado
    @GetMapping("/exists")
    public ResponseEntity<Map<String, Object>> existsByDateAndState(@RequestParam Date date,
                                                                    @RequestParam StateAttendance state) {
        try {
            boolean exists = attendanceService.existsByAttendanceDateAndStateAttendance(date, state);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK,
                    "Exists: " + exists),
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error checking existence: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para agregar una nueva asistencia
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Map<String, Object> json) {
        try {
            attendanceBusiness.add(json);
            return new ResponseEntity<>(ResponseHttpApi.responseHttpAction(
                    ResponseHttpApi.CODE_OK,
                    "Attendance added successfully"),
                    HttpStatus.CREATED);
        } catch (CustomException e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    e.getMessage(), HttpStatus.BAD_REQUEST, "Bad Request"),
                    HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseHttpApi.responseHttpError(
                    "Error adding attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para generar un código QR
    @GetMapping("/generateQRCode")
    public ResponseEntity<byte[]> generateQRCode() {
        try {
            String frontendUrl = "https://8a4c-152-200-176-22.ngrok-free.app/qrformulariomovil";  // URL a modificar según el entorno
            byte[] qrCode = qrCodeGenerator.generateQRCodeImage(frontendUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "image/png");
            return new ResponseEntity<>(qrCode, headers, HttpStatus.OK);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
