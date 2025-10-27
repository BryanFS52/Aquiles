package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ImprovementPlanDto;
import com.api.aquilesApi.Entity.ImprovementPlan;
import com.api.aquilesApi.Service.ImprovementPlanService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.ImprovementPlanMap;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class ImprovementPlanBusiness {
    private final ImprovementPlanService improvementPlanService;

    public ImprovementPlanBusiness(ImprovementPlanService improvementPlanService) {
        this.improvementPlanService = improvementPlanService;
    }

    // Validation object
    private void validationObject(ImprovementPlanDto improvementplanDto) throws CustomException {

    }

    // Get all improvementPlans (Paginated)
    public Page<ImprovementPlanDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ImprovementPlan> improvementPlanPage = improvementPlanService.findAll(pageRequest);

            System.out.println("Total ImprovementPlans: " + improvementPlanPage.getTotalElements());

            return ImprovementPlanMap.INSTANCE.EntityToDTOs(improvementPlanPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving improvemenPlan due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving improvemenPlan.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get improvementPlan by ID
    public ImprovementPlanDto findById(Long id) {
        try {
            ImprovementPlan improvementPlan = improvementPlanService.getById(id);
            return ImprovementPlanMap.INSTANCE.EntityToDto(improvementPlan);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get improvementPlan by studentId
    public List<ImprovementPlan> findAllByStudentId(Long id){
        try {
            return improvementPlanService.findAllByStudentId(id);
        } catch (Exception e) {
            throw new CustomException("Error Getting Improvement Plans by Student ID: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get improvementPlan by Filter
    public Page<ImprovementPlanDto> findByFilter(int page, int size, Long teacherCompetence) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ImprovementPlan> improvementPlanPage = improvementPlanService.findByFilter(pageRequest, teacherCompetence);

            System.out.println("Total inprovementPlans: " + improvementPlanPage.getTotalElements());

            return ImprovementPlanMap.INSTANCE.EntityToDTOs(improvementPlanPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving improvemenPlan by filter due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving improvemenPlan by filter.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get improvementPlans by StudySheetId (Ficha)
    public Page<ImprovementPlanDto> findByStudySheetId(int page, int size, Long studySheetId) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ImprovementPlan> improvementPlanPage = improvementPlanService.findByStudySheetId(pageRequest, studySheetId);

            System.out.println("Total improvementPlans (by studySheetId): " + improvementPlanPage.getTotalElements());

            return ImprovementPlanMap.INSTANCE.EntityToDTOs(improvementPlanPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving improvementPlans by studySheetId due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving improvementPlans by studySheetId.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get improvementPlan by teacherCompetence
    public List<Long> findAllByTeacherCompetence(Long teacherCompetence) {
        try {
            return improvementPlanService.findAllByTeacherCompetence(teacherCompetence);
        } catch (Exception e) {
            throw new CustomException("Error Getting Teacher Competence IDs: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get improvementPlan by learningOutcome
    public List<ImprovementPlan> findAllByLearningOutcome(Long learningOutcome) {
        try {
            return improvementPlanService.findAllByLearningOutcome(learningOutcome);
        } catch (Exception e) {
            throw new CustomException("Error Getting Improvement Plans by Learning Outcome: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add new improvementPlan
    public ImprovementPlanDto add(ImprovementPlanDto improvementplanDto) {
        try {
            ImprovementPlan improvementPlan = new ImprovementPlan();
            ImprovementPlanMap.INSTANCE.updateImprovementPlan(improvementplanDto, improvementPlan);
            ImprovementPlan savedImprovementPlan = improvementPlanService.save(improvementPlan);
            return ImprovementPlanMap.INSTANCE.EntityToDto(savedImprovementPlan);
        } catch ( Exception e){
            throw new CustomException(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }

    // Update existing improvementPlan
    public void update(Long improvementPlanId, ImprovementPlanDto improvementplanDto) {
        try {
            improvementplanDto.setId(improvementPlanId);
            ImprovementPlan improvementPlan = improvementPlanService.getById(improvementPlanId);
            ImprovementPlanMap.INSTANCE.updateImprovementPlan(improvementplanDto, improvementPlan);
            improvementPlanService.update(improvementPlan);
        } catch (Exception e) {
            throw new CustomException("Error Updating Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete improvementPlan by ID
    public void delete(Long id) {
        try {
            ImprovementPlan improvementPlan = improvementPlanService.getById(id);
            improvementPlanService.delete(improvementPlan);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}