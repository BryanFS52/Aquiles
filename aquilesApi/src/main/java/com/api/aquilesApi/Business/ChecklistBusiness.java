package com.api.aquilesApi.Business;

import java.nio.charset.StandardCharsets;
import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.Evaluations;
import com.api.aquilesApi.Repository.JuriesRepository;
import com.api.aquilesApi.Service.ChecklistExportService;
import com.api.aquilesApi.Service.ChecklistService;
import com.api.aquilesApi.Service.EvaluationsService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service // <<-- cambiado de @Component a @Service
public class ChecklistBusiness {

    private final ChecklistService checklistService;
    private final ModelMapper modelMapper;
    private final EvaluationsService EvaluationsService;
    private final ChecklistExportService exportService;


    public ChecklistBusiness(
            ChecklistService checklistService,
            JuriesRepository juriesRepository,
            ModelMapper modelMapper,
            EvaluationsService evaluationService, // <<-- inyección correcta
            ChecklistExportService exportService
    ) {
        this.checklistService = checklistService;
        this.modelMapper = modelMapper;
        this.EvaluationsService = evaluationService;
        this.exportService = exportService;
    }   

    // Find All
    public Page<ChecklistDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Checklist> checklistEntityPage = checklistService.findAll(pageRequest);

            System.out.println("Total Checklist: " + checklistEntityPage.getTotalElements());

            return checklistEntityPage.map(entity -> modelMapper.map(entity, ChecklistDto.class));
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving checklist due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving checklist.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Find By Id
    public ChecklistDto findById(Long id) {
        try {
            Checklist checklist = checklistService.getById(id);
            return modelMapper.map(checklist, ChecklistDto.class);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
public ChecklistDto add(ChecklistDto checklistDto) {
    try {
        // Paso 1: mapear campos simples
        Checklist checklist = modelMapper.map(checklistDto, Checklist.class);

        // 🔧 Conversión manual del String a byte[] para instructorSignature
        if (checklistDto.getInstructorSignature() != null) {
            checklist.setInstructorSignature(
                checklistDto.getInstructorSignature().getBytes(java.nio.charset.StandardCharsets.UTF_8)
            );
        }

        // Paso 2: asignar manualmente la entidad Evaluations si se proporciona un ID
        if (checklistDto.getEvaluations() != null) {
            Evaluations eval = EvaluationsService.findById(checklistDto.getEvaluations());
            checklist.setEvaluation(eval);
        }

        // Paso 3: guardar y retornar
        Checklist saved = checklistService.save(checklist);
        return modelMapper.map(saved, ChecklistDto.class);
    } catch (Exception e) {
        throw new CustomException("Error creating checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}

    
//update

public void update(Long checklistId, ChecklistDto checklistDto) {
    try {
        Checklist checklist = checklistService.getById(checklistId);

        checklist.setState(checklistDto.getState());
        checklist.setRemarks(checklistDto.getRemarks());
        checklist.setStudySheets(checklistDto.getStudySheets());
        checklist.setEvaluationCriteria(checklistDto.isEvaluationCriteria());

        if (checklistDto.getInstructorSignature() != null) {
            checklist.setInstructorSignature(
                checklistDto.getInstructorSignature().getBytes(StandardCharsets.UTF_8)
            );
        }

        // ✅ Modificar la evaluación ya existente asociada al checklist
        Evaluations eval = checklist.getEvaluation();
        if (eval != null) {
            eval.setValueJudgment("Nuevo juicio de valor");
            eval.setObservations("Observaciones actualizadas");
            // Modifica aquí lo que necesites
        }

        checklistService.save(checklist); // cascade guarda la evaluación también

    } catch (Exception e) {
        throw new CustomException("Error Updating Checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}

    
    

    // Delete
    public void delete(Long attendanceId) {
        try {
            Checklist checklist = checklistService.getById(attendanceId);
            checklistService.delete(checklist);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }



//Export documents
// Export PDF
public String exportChecklistPdf(Long checklistId) {
    Checklist checklist = checklistService.getById(checklistId);
    return exportService.exportPdfBase64(checklist);
}

// Export Excel
public String exportChecklistExcel(Long checklistId) {
    Checklist checklist = checklistService.getById(checklistId);
    return exportService.exportExcelBase64(checklist);
}
}
