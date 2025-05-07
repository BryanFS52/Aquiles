package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.AttendancesBusiness;
import com.api.aquilesApi.Dto.AttendancesDto;
import com.api.aquilesApi.Dto.QRCodePayload;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.api.aquilesApi.Utilities.QrCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;

import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Controller
public class AttendancesController {
    @Autowired
    private AttendancesBusiness attendancesBusiness;

    @Autowired
    private QrCodeGenerator qrCodeGenerator;

    @QueryMapping
    public Map<String, Object> allAttendances(@Argument int page, @Argument int size) {
        try {
            Page<AttendancesDto> attendancesDtoPage = attendancesBusiness.findAll(page, size);

            return ResponseHttpApi.responseHttpFindAll(
                    attendancesDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    attendancesDtoPage.getTotalPages(),
                    page,
                    (int) attendancesDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @QueryMapping
    public Map<String, Object> attendanceById(@Argument Long id) {
        try {
            AttendancesDto attendancesDto = attendancesBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    attendancesDto,
                    ResponseHttpApi.CODE_OK,
                    "query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @MutationMapping
    public Map<String, Object> addAttendance(@Argument("input") AttendancesDto attendancesDto) {
        try {
             AttendancesDto attendancesDto1 = attendancesBusiness.add(attendancesDto);
            return ResponseHttpApi.responseHttpAction(
                    attendancesDto1.getAttendanceId(),
                    ResponseHttpApi.CODE_OK,
                    "add ok"
            );
        }catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @MutationMapping
    public Map<String, Object> updateAttendance(@Argument Long id, @Argument ("input")AttendancesDto attendancesDto) {
        try {
             attendancesBusiness.update(id, attendancesDto );
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "update ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @MutationMapping
    public Map<String, Object> deleteAttendance(@Argument Long id) {
        try {
            attendancesBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                   id,
                   ResponseHttpApi.CODE_OK,
                    "delete ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Generate Qr
    @Value("${frontend.url}")
    private String frontendUrl;
    @MutationMapping
    public QRCodePayload generateQRCode() throws Exception {
        String sessionId = UUID.randomUUID().toString();
        String qrUrl = frontendUrl + "/FormularioQRAsistencia?session=" + sessionId;

        byte[] qrCode = qrCodeGenerator.generateQRCodeImage(qrUrl);
        String qrCodeBase64 = Base64.getEncoder().encodeToString(qrCode);

        return new QRCodePayload(sessionId, qrCodeBase64, qrUrl);
    }

}