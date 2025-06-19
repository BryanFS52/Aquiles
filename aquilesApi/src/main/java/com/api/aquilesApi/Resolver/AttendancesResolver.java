package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.AttendancesBusiness;
import com.api.aquilesApi.Dto.AttendancesDto;
import com.api.aquilesApi.Dto.QRCodePayload;
import com.api.aquilesApi.Dto.Student;
import com.api.aquilesApi.Entity.AttendanceEntity;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.api.aquilesApi.Utilities.QrCodeGenerator;
import com.netflix.graphql.dgs.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@DgsComponent
public class AttendancesResolver {
    private final AttendancesBusiness attendancesBusiness;
    private final QrCodeGenerator qrCodeGenerator;
    private final ModelMapper modelMapper = new ModelMapper();

    public AttendancesResolver(AttendancesBusiness attendancesBusiness, QrCodeGenerator qrCodeGenerator ) {
        this.attendancesBusiness = attendancesBusiness;
        this.qrCodeGenerator = qrCodeGenerator;
    }

    // Olympo
    @DgsEntityFetcher(name = "Student")
    public Student getStudent(Map<String, Object> values) {
        System.out.println("Resolviendo entidad Student con valores: " + values);

        Long id = null;
        if (values.get("id") instanceof String) {
            id = Long.valueOf((String) values.get("id"));
        } else if (values.get("id") instanceof Integer) {
            id = ((Integer) values.get("id")).longValue();
        } else if (values.get("id") instanceof Long) {
            id = (Long) values.get("id");
        }

        if (id == null) return null;

        Student student = new Student();
        student.setId(id);
        return student;
    }

    @DgsData(parentType = "Student", field = "attendances")
    public List<AttendanceEntity> getAttendances(DgsDataFetchingEnvironment env) {
        Student student = env.getSource();
        assert student != null;

        Long studentId = student.getId();

        List<AttendancesDto> attendancesDtoList = attendancesBusiness.findAllByStudentId(studentId);

        return attendancesDtoList.stream()
                .map(dto -> modelMapper.map(dto, AttendanceEntity.class))
                .collect(Collectors.toList());
    }

    @DgsEntityFetcher(name = "Attendance")
    public AttendancesDto getAttendance(Map<String, Object> values) {
        String id = (String) values.get("id");
        Long attendanceId = id != null ? Long.valueOf(id) : null;
        return attendancesBusiness.findById(attendanceId);
    }

    @DgsData(parentType = "Attendance", field = "student")
    public Map<String, Object> studentReference(DgsDataFetchingEnvironment env) {
        AttendancesDto attendancesDto = env.getSource();
        assert attendancesDto != null;
        if(attendancesDto.getStudentId() == null) return null;
        return Map.of("id", attendancesDto.getStudentId().toString());
    }

    @DgsQuery
    public Map<String, Object> allAttendancesByStudentId(@InputArgument Long id, @InputArgument Long stateId) {
        List<AttendancesDto> attendances = attendancesBusiness.findAllByStudentId(id, stateId);
        return ResponseHttpApi.responseHttpFindAllList(
                attendances,
                ResponseHttpApi.CODE_OK,
                "query attendances by id ok",
                attendances.size()
        );
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
    public Map<String, Object> attendanceById(@InputArgument Long id) {
        try {
            AttendancesDto attendancesDto = attendancesBusiness.findById(id);
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
            System.out.println(attendancesDto);
            AttendancesDto attendancesDto1 = attendancesBusiness.add(attendancesDto);
            return ResponseHttpApi.responseHttpAction(
                    attendancesDto1.getId(),
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
    public Map<String, Object> updateAttendance(@InputArgument Long id, @InputArgument ( name = "input")AttendancesDto attendancesDto) {
        try {
             attendancesBusiness.update(id, attendancesDto );
            return ResponseHttpApi.responseHttpAction(
                    id,
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
    public Map<String, Object> deleteAttendance(@InputArgument Long id) {
        try {
            attendancesBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
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