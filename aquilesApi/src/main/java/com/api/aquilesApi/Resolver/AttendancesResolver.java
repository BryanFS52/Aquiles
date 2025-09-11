package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.AttendancesBusiness;
import com.api.aquilesApi.Dto.AttendanceDto;
import com.api.aquilesApi.Dto.QRCodePayloadDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.api.aquilesApi.Utilities.QRCode.QrCodeGenerator;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@DgsComponent
public class AttendancesResolver {
    private final AttendancesBusiness attendancesBusiness;
    private final QrCodeGenerator qrCodeGenerator;

    public AttendancesResolver(AttendancesBusiness attendancesBusiness, QrCodeGenerator qrCodeGenerator) {
        this.attendancesBusiness = attendancesBusiness;
        this.qrCodeGenerator = qrCodeGenerator;
    }

    // FindAll Attendances (GraphQL)
    @DgsQuery
    public Map<String, Object> allAttendances(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<AttendanceDto> attendancesDtoPage = attendancesBusiness.findAll(page, size);
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
                    "Error retrieving Attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DgsQuery
    public Map<String, Object> allAttendancesByStudentId(@InputArgument Long id, @InputArgument Long stateId, @InputArgument Integer page, @InputArgument Integer size) {
        try {
            int safePage = (page != null) ? page : 0;
            int safeSize = (size != null) ? size : 10;

            Pageable pageable = PageRequest.of(safePage, safeSize);
            Page<AttendanceDto> attendances = attendancesBusiness.findAllByStudentId(id, stateId, pageable);

            return ResponseHttpApi.responseHttpFindAll(
                    attendances.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "query attendances by id ok",
                    attendances.getSize(),
                    safePage,
                    attendances.getTotalPages()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById Attendance (GraphQL)
    @DgsQuery
    public Map<String, Object> attendanceById(@InputArgument Long id) {
        try {
            AttendanceDto attendanceDto = attendancesBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    attendanceDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new Attendance (GraphQL)
    @DgsMutation
    public Map<String, Object> addAttendance(@InputArgument(name = "input") AttendanceDto attendanceDto) {
        try {
            System.out.println(attendanceDto);
            AttendanceDto attendanceDto1 = attendancesBusiness.add(attendanceDto);
            return ResponseHttpApi.responseHttpAction(
                    attendanceDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Attendance created successfully"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding Attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update Attendance (GraphQL)
    @DgsMutation
    public Map<String, Object> updateAttendance(@InputArgument Long id, @InputArgument ( name = "input") AttendanceDto attendanceDto) {
        try {
            attendancesBusiness.update(id, attendanceDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Attendance updated successfully"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating Attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete Attendance (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteAttendance(@InputArgument Long id) {
        try {
            attendancesBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Attendance deleted successfully"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting Attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Generate QR (GraphQL)
    @Value("${frontend.url}")
    private String frontendUrl;
    @DgsMutation
    public QRCodePayloadDto generateQRCode() throws Exception {
        String sessionId = UUID.randomUUID().toString();
        String qrUrl = frontendUrl + "/dashboard/FormularioQRAsistencia?session=" + sessionId;

        byte[] qrCode = qrCodeGenerator.generateQRCodeImage(qrUrl);
        String qrCodeBase64 = Base64.getEncoder().encodeToString(qrCode);

        return new QRCodePayloadDto(sessionId, qrCodeBase64, qrUrl);
    }
}