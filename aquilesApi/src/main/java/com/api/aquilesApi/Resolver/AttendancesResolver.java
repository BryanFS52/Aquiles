package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.AttendancesBusiness;
import com.api.aquilesApi.Dto.AttendanceDto;
import com.api.aquilesApi.Dto.QRCodePayloadDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.api.aquilesApi.Utilities.QRCode.QrCodeGenerator;
import com.api.aquilesApi.Utilities.Exception.BadRequestException;
import com.api.aquilesApi.Utilities.Exception.NotFoundException;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
            if (!attendancesDtoPage.isEmpty()){
                return ResponseHttpApi.responseHttpFindAll(
                        attendancesDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Query ok",
                        attendancesDtoPage.getTotalPages(),
                        page,
                        (int) attendancesDtoPage.getTotalElements()
                );
            } else {
                throw new NotFoundException("No Attendances found");
            }
        } catch (Exception exception) {
            throw new RuntimeException("Unexpected error in allAttendances: " + exception.getMessage(), exception);
        }
    }

    // Find Attendances By StudentId (GraphQL)
    @DgsQuery
    public Map<String, Object> allAttendancesByStudentId(@InputArgument Long id, @InputArgument Long stateId, @InputArgument Integer page, @InputArgument Integer size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<AttendanceDto> attendances = attendancesBusiness.findAllByStudentId(id, stateId, pageable);
            if (!attendances.isEmpty()) {
                return ResponseHttpApi.responseHttpFindAll(
                        attendances.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "query attendances by id ok",
                        attendances.getSize(),
                        page,
                        attendances.getTotalPages()
                );
            } else {
                throw new NotFoundException("No Attendances found for student id: " + id);
            }
        } catch (Exception exception) {
            throw new RuntimeException("Unexpected error in allAttendancesByStudentId: " + exception.getMessage(), exception);
        }
    }

    // FindById Attendance (GraphQL)
    @DgsQuery
    public Map<String, Object> attendanceById(@InputArgument Long id) {
        try {
            AttendanceDto attendanceDto = attendancesBusiness.findById(id);
            if (attendanceDto == null) {
                throw new NotFoundException("Attendance not found for id: " + id);
            }
            return ResponseHttpApi.responseHttpFindId(
                    attendanceDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception exception) {
            throw new RuntimeException("Unexpected error in attendanceById: " + exception.getMessage(), exception);
        }
    }

    // FindAll Attendances By CompetenceQuarterId With Justifications (GraphQL)
    @DgsQuery
    public Map<String, Object> allAttendanceByCompetenceQuarterIdWithJustifications(@InputArgument Long competenceQuarterId, @InputArgument Integer page, @InputArgument Integer size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<AttendanceDto> attendances = attendancesBusiness.findAllByCompetenceQuarterId(competenceQuarterId, pageable);
            if (!attendances.isEmpty()) {
                return ResponseHttpApi.responseHttpFindAll(
                        attendances.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Query by competence quarter id ok",
                        attendances.getSize(),
                        page,
                        attendances.getTotalPages()
                );
            } else {
                throw new NotFoundException("No Attendances found for competence quarter id: " + competenceQuarterId);
            }
        } catch (Exception exception) {
            throw new RuntimeException("Unexpected error in allAttendanceByCompetenceQuarterIdWithJustifications: " + exception.getMessage(), exception);
        }
    }

    // Add a new Attendance (GraphQL)
    @DgsMutation
    public Map<String, Object> addAttendance(@InputArgument(name = "input") AttendanceDto attendanceDto) {
        try {
            if (attendanceDto == null) {
                throw new BadRequestException("Attendance input cannot be null");
            }
            AttendanceDto attendanceDto1 = attendancesBusiness.add(attendanceDto);
            return ResponseHttpApi.responseHttpAction(
                    attendanceDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Attendance created successfully"
            );
        } catch (Exception exception) {
            throw new RuntimeException("Unexpected error in addAttendance: " + exception.getMessage(), exception);
        }
    }

    // Update Attendance (GraphQL)
    @DgsMutation
    public Map<String, Object> updateAttendance(@InputArgument Long id, @InputArgument ( name = "input") AttendanceDto attendanceDto) {
        try {
            if (attendanceDto == null) {
                throw new BadRequestException("Attendance input cannot be null");
            }
            attendancesBusiness.update(id, attendanceDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Attendance updated successfully"
            );
        } catch (Exception exception) {
            throw new RuntimeException("Unexpected error in updateAttendance: " + exception.getMessage(), exception);
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
        } catch (Exception exception) {
            throw new RuntimeException("Unexpected error in deleteAttendance: " + exception.getMessage(), exception);
        }
    }

    // Generate QR (GraphQL)
    @Value("${frontend.url}")
    private String frontendUrl;
    @DgsMutation
    public QRCodePayloadDto generateQRCode() {
        try {
            String sessionId = UUID.randomUUID().toString();
            String qrUrl = frontendUrl + "/dashboard/FormularioQRAsistencia?session=" + sessionId;
            byte[] qrCode = qrCodeGenerator.generateQRCodeImage(qrUrl);
            String qrCodeBase64 = Base64.getEncoder().encodeToString(qrCode);
            return new QRCodePayloadDto(sessionId, qrCodeBase64, qrUrl);
        } catch (Exception exception) {
            throw new RuntimeException("Unexpected error in generateQRCode: " + exception.getMessage(), exception);
        }
    }
}