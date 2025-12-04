package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ChecklistQualificationBusiness;
import com.api.aquilesApi.Dto.ChecklistQualificationDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

@DgsComponent
public class ChecklistQualificationResolver {

    private final ChecklistQualificationBusiness checklistQualificationBusiness;

    public ChecklistQualificationResolver(ChecklistQualificationBusiness checklistQualificationBusiness) {
        this.checklistQualificationBusiness = checklistQualificationBusiness;
    }

    // FindAll ChecklistQualifications
    @DgsQuery
    public Map<String, Object> allChecklistQualifications(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<ChecklistQualificationDto> qualificationPage = checklistQualificationBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    qualificationPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    qualificationPage.isEmpty() ? "No hay calificaciones disponibles" : "Query ok",
                    qualificationPage.getTotalPages(),
                    page,
                    (int) qualificationPage.getTotalElements()
            );
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error in allChecklistQualifications: " + e.getMessage(), e);
        }
    }

    // FindById ChecklistQualification
    @DgsQuery
    public Map<String, Object> checklistQualificationById(@InputArgument Long id) {
        try {
            ChecklistQualificationDto qualificationDto = checklistQualificationBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    qualificationDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error in checklistQualificationById: " + e.getMessage(), e);
        }
    }

    // Get qualifications by checklist and team
    @DgsQuery
    public List<ChecklistQualificationDto> checklistQualificationsByChecklist(
            @InputArgument Long checklistId,
            @InputArgument Long teamScrumId) {
        try {
            return checklistQualificationBusiness.findByChecklistAndTeam(checklistId, teamScrumId);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error in checklistQualificationsByChecklist: " + e.getMessage(), e);
        }
    }

    // Save or Update ChecklistQualification
    @DgsMutation
    public Map<String, Object> saveOrUpdateChecklistQualification(
            @InputArgument(name = "input") ChecklistQualificationDto input) {
        try {
            ChecklistQualificationDto savedDto = checklistQualificationBusiness.saveOrUpdate(input);
            return ResponseHttpApi.responseHttpAction(
                    savedDto.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Calificación guardada exitosamente"
            );
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error in saveOrUpdateChecklistQualification: " + e.getMessage(), e);
        }
    }

    // Delete ChecklistQualification
    @DgsMutation
    public Map<String, Object> deleteChecklistQualification(@InputArgument Long id) {
        try {
            checklistQualificationBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error in deleteChecklistQualification: " + e.getMessage(), e);
        }
    }
}
