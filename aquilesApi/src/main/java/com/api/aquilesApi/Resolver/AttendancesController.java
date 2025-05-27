package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.AttendancesBusiness;
import com.api.aquilesApi.Dto.AttendancesDto;
import com.api.aquilesApi.Dto.QRCodePayload;
import com.api.aquilesApi.Utilities.DataConvert;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.api.aquilesApi.Utilities.QrCodeGenerator;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@DgsComponent
public class AttendancesController {
    private final AttendancesBusiness attendancesBusiness;
    private final QrCodeGenerator qrCodeGenerator;
    private final DataConvert dataConvert = new DataConvert();

    public AttendancesController(AttendancesBusiness attendancesBusiness, QrCodeGenerator qrCodeGenerator) {
        this.attendancesBusiness = attendancesBusiness;
        this.qrCodeGenerator = qrCodeGenerator;
    }

    // FindAll Attendances (GraphQL)
    @DgsQuery
    public Map<String, Object> allAttendances(@InputArgument Integer page, @InputArgument Integer size) {
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

    // FindById Attendance (GraphQL)
    @DgsQuery
    public Map<String, Object> attendanceById(@InputArgument String id) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            AttendancesDto attendancesDto = attendancesBusiness.findById(idLong);
            return ResponseHttpApi.responseHttpFindId(
                    attendancesDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new Attendance (GraphQL)
    @DgsMutation
    public Map<String, Object> addAttendance(@InputArgument(name = "input") AttendancesDto attendancesDto) {
        try {
            AttendancesDto attendancesDto1 = attendancesBusiness.add(attendancesDto);
            return ResponseHttpApi.responseHttpAction(
                    attendancesDto1.getAttendanceId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update Attendance (GraphQL)
    @DgsMutation
    public Map<String, Object> updateAttendance(@InputArgument String id, @InputArgument ( name = "input")AttendancesDto attendancesDto) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
             attendancesBusiness.update(idLong, attendancesDto );
            return ResponseHttpApi.responseHttpAction(
                    idLong,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete Attendance (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteAttendance(@InputArgument String id) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            attendancesBusiness.delete(idLong);
            return ResponseHttpApi.responseHttpAction(
                    idLong,
                   ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Generate QR (GraphQL)
    @Value("${frontend.url}")
    private String frontendUrl;
    @DgsMutation
    public QRCodePayload generateQRCode() throws Exception {
        String sessionId = UUID.randomUUID().toString();
        String qrUrl = frontendUrl + "/FormularioQRAsistencia?session=" + sessionId;

        byte[] qrCode = qrCodeGenerator.generateQRCodeImage(qrUrl);
        String qrCodeBase64 = Base64.getEncoder().encodeToString(qrCode);

        return new QRCodePayload(sessionId, qrCodeBase64, qrUrl);
    }
}