package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.EvaluationDto;
import com.api.aquilesApi.Entity.Evaluation;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.api.aquilesApi.Service.EvaluationsService;
import com.api.aquilesApi.Service.ChecklistService;
import com.api.aquilesApi.Service.TeamScrumService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.EvaluationMap;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;


@Component
public class EvaluationsBusiness {
   private final EvaluationsService evaluationsService;
   private final ChecklistService checklistService;
   private final TeamScrumService teamScrumService;

    public EvaluationsBusiness(EvaluationsService evaluationsService, 
                               ChecklistService checklistService,
                               TeamScrumService teamScrumService) {
        this.evaluationsService = evaluationsService;
        this.checklistService = checklistService;
        this.teamScrumService = teamScrumService;
    }

    // Validation Object


    // Get all evaluations (Paginated)
    public Page<EvaluationDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Evaluation> evaluationsPage = evaluationsService.findAll(pageRequest);
            return EvaluationMap.INSTANCE.EntityToDTOs(evaluationsPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving attendances due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving attendances.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Evaluation by ID
    public EvaluationDto findById(Long id) {
        try {
            Evaluation evaluation = evaluationsService.getById(id);
            return EvaluationMap.INSTANCE.EntityToDTO(evaluation);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add new evaluation
    public EvaluationDto add(EvaluationDto evaluationDto) {
        try {
            // Verificar si ya existe una evaluación para este checklist y team scrum
            if (evaluationDto.getChecklistId() != null) {
                Checklist checklist = checklistService.getById(evaluationDto.getChecklistId());
                
                // Si se proporciona teamScrumId, verificar que no exista ya una evaluación para este checklist + team
                if (evaluationDto.getTeamScrumId() != null) {
                    Evaluation existingEvaluation = evaluationsService.findByChecklistAndTeam(
                        evaluationDto.getChecklistId(), 
                        evaluationDto.getTeamScrumId()
                    );
                    if (existingEvaluation != null) {
                        throw new CustomException("Ya existe una evaluación para este checklist y team scrum. ID de evaluación: " + existingEvaluation.getId(), HttpStatus.CONFLICT);
                    }
                }
                
                Evaluation evaluation = new Evaluation();
                evaluation.setObservations(evaluationDto.getObservations());
                evaluation.setRecommendations(evaluationDto.getRecommendations());
                evaluation.setValueJudgment(evaluationDto.getValueJudgment());
                evaluation.setChecklist(checklist);
                
                // Si se proporciona teamScrumId, asignarlo
                if (evaluationDto.getTeamScrumId() != null) {
                    TeamsScrum teamsScrum = teamScrumService.getById(evaluationDto.getTeamScrumId());
                    evaluation.setTeamsScrum(teamsScrum);
                }
                
                Evaluation savedEvaluation = evaluationsService.save(evaluation);
                return EvaluationMap.INSTANCE.EntityToDTO(savedEvaluation);
            } else {
                throw new CustomException("El checklistId es obligatorio para crear una evaluación", HttpStatus.BAD_REQUEST);
            }
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error creating evaluation: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update existing evaluation
    public void update(Long evaluationId, EvaluationDto evaluationDto) {
        try {
            evaluationDto.setId(evaluationId);
            Evaluation evaluation = evaluationsService.getById( evaluationId);
            EvaluationMap.INSTANCE.updateEvaluation(evaluationDto, evaluation);
            evaluationsService.save(evaluation);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete evaluation by ID
    public void delete(Long evaluationId) {
        try {
            Evaluation evaluation = evaluationsService.getById(evaluationId);
            evaluationsService.delete(evaluation);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Buscar evaluación por checklist y team scrum
    public EvaluationDto findByChecklistAndTeam(Long checklistId, Long teamScrumId) {
        Evaluation evaluation = evaluationsService.findByChecklistAndTeam(checklistId, teamScrumId);
        if (evaluation == null) {
            return null;
        }
        return EvaluationMap.INSTANCE.EntityToDTO(evaluation);
    }
}