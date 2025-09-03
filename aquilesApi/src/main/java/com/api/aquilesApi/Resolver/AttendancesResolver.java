package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.AttendancesBusiness;
import com.api.aquilesApi.Dto.AttendanceDto;
import com.api.aquilesApi.Dto.QRCodePayloadDto;
import com.api.aquilesApi.Dto.Student;
import com.api.aquilesApi.Entity.Attendance;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.api.aquilesApi.Utilities.QRCode.QrCodeGenerator;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import com.netflix.graphql.dgs.DgsEntityFetcher;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Collections;


@DgsComponent
public class AttendancesResolver {
    private final AttendancesBusiness attendancesBusiness;
    private final QrCodeGenerator qrCodeGenerator;
    private final ModelMapper modelMapper;

    public AttendancesResolver(AttendancesBusiness attendancesBusiness, QrCodeGenerator qrCodeGenerator, ModelMapper modelMapper) {
        this.attendancesBusiness = attendancesBusiness;
        this.qrCodeGenerator = qrCodeGenerator;
        this.modelMapper = modelMapper;
    }

    // Olympus
    @DgsEntityFetcher(name = "Student")
    public Student getStudent(Map<String, Object> values) {
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

    @DgsEntityFetcher(name = "Attendance")
    public AttendanceDto getAttendance(Map<String, Object> values) {
        String id = (String) values.get("id");
        Long attendanceId = id != null ? Long.valueOf(id) : null;
        return attendancesBusiness.findById(attendanceId);
    }

    @DgsData(parentType = "Student", field = "attendances")
    public List<Attendance> getAttendances(DgsDataFetchingEnvironment env) {
        Student student = env.getSource();
        Long studentId = student.getId();

        Long competenceQuarterId = env.getArgument("competenceQuarterId");
        List<Attendance> attendanceList;

        if (competenceQuarterId != null) {
            attendanceList = attendancesBusiness.getAllByStudentIdAndCompetenceQuarter(studentId, competenceQuarterId);
        } else {
            attendanceList = attendancesBusiness.findAllByStudentId(studentId);
        }

        return attendanceList != null ? attendanceList : Collections.emptyList();
    }



    @DgsData(parentType = "Attendance", field = "student")
    public Map<String, Object> studentReference(DgsDataFetchingEnvironment env) {
        AttendanceDto attendanceDto = env.getSource();
        assert attendanceDto != null;
        if(attendanceDto.getStudentId() == null) return null;
        return Map.of("id", attendanceDto.getStudentId().toString());
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
    // Attendance by Student whit Justification


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
    public Map<String, Object> allAttendanceByCompetenceQuarterIdWithJustifications( @InputArgument Long competenceQuarterId, @InputArgument Integer page, @InputArgument Integer size) {
        try {
            int safePage = (page != null) ? page : 0;
            int safeSize = (size != null) ? size : 10;

            Pageable pageable = PageRequest.of(safePage, safeSize);
            Page<AttendanceDto> attendances = attendancesBusiness.findAllByCompetenceQuarterId(competenceQuarterId, pageable);

            return ResponseHttpApi.responseHttpFindAll(
                    attendances.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query by competence quarter id ok",
                    attendances.getSize(),
                    safePage,
                    attendances.getTotalPages()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
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
                    "Add ok"
            );
        }catch (Exception e) {
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
                    "Update ok"
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
                    "Delete ok"
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
        String qrUrl = frontendUrl + "/FormularioQRAsistencia?session=" + sessionId;

        byte[] qrCode = qrCodeGenerator.generateQRCodeImage(qrUrl);
        String qrCodeBase64 = Base64.getEncoder().encodeToString(qrCode);

        return new QRCodePayloadDto(sessionId, qrCodeBase64, qrUrl);
    }
}