package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ChecklistQualificationDto;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.ChecklistQualification;
import com.api.aquilesApi.Entity.Item;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.api.aquilesApi.Service.ChecklistQualificationService;
import com.api.aquilesApi.Service.ChecklistService;
import com.api.aquilesApi.Service.ItemService;
import com.api.aquilesApi.Service.TeamScrumService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.ChecklistQualificationMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ChecklistQualificationBusiness {
    private final ChecklistQualificationService checklistQualificationService;
    private final ItemService itemService;
    private final TeamScrumService teamScrumService;
    private final ChecklistService checklistService;

    public ChecklistQualificationBusiness(
            ChecklistQualificationService checklistQualificationService,
            ItemService itemService,
            TeamScrumService teamScrumService,
            ChecklistService checklistService) {
        this.checklistQualificationService = checklistQualificationService;
        this.itemService = itemService;
        this.teamScrumService = teamScrumService;
        this.checklistService = checklistService;
    }

    private void validationObject(ChecklistQualificationDto checklistQualificationDto) throws CustomException {
        if (checklistQualificationDto.getItemId() == null) {
            throw new CustomException("Item ID is required", HttpStatus.BAD_REQUEST);
        }
        if (checklistQualificationDto.getTeamScrumId() == null) {
            throw new CustomException("Team Scrum ID is required", HttpStatus.BAD_REQUEST);
        }
        if (checklistQualificationDto.getChecklistId() == null) {
            throw new CustomException("Checklist ID is required", HttpStatus.BAD_REQUEST);
        }
    }

    public Page<ChecklistQualificationDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ChecklistQualification> checklistQualificationPage = checklistQualificationService.findAll(pageRequest);
            return ChecklistQualificationMap.INSTANCE.EntityToDTOs(checklistQualificationPage);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving checklist qualifications."+ e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public ChecklistQualificationDto findById(Long id) {
        try {
            ChecklistQualification checklistQualification = checklistQualificationService.getById(id);
            return ChecklistQualificationMap.INSTANCE.EntityToDTO(checklistQualification);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving the checklist qualification." + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public ChecklistQualificationDto saveOrUpdate(ChecklistQualificationDto dto) {
        try {
            validationObject(dto);
            
            Optional<ChecklistQualification> existingQualification = checklistQualificationService.findByItemTeamAndChecklist(dto.getItemId(), dto.getTeamScrumId(), dto.getChecklistId());
            
            ChecklistQualification qualification;
            
            if (existingQualification.isPresent()) {
                qualification = existingQualification.get();
                qualification.setQualificationState(dto.getQualificationState());
                qualification.setObservations(dto.getObservations());
            } else {
                qualification = new ChecklistQualification();
                qualification.setQualificationState(dto.getQualificationState());
                qualification.setObservations(dto.getObservations());
                
                Item item = itemService.findById(dto.getItemId());
                TeamsScrum teamScrum = teamScrumService.getById(dto.getTeamScrumId());
                Checklist checklist = checklistService.getById(dto.getChecklistId());
                
                qualification.setItem(item);
                qualification.setTeamsScrum(teamScrum);
                qualification.setChecklist(checklist);
            }
            
            ChecklistQualification savedQualification = checklistQualificationService.save(qualification);
            return ChecklistQualificationMap.INSTANCE.EntityToDTO(savedQualification);
            
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error saving/updating checklist qualification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public List<ChecklistQualificationDto> findByChecklistAndTeam(Long checklistId, Long teamScrumId) {
        try {
            List<ChecklistQualification> qualifications = checklistQualificationService.findByChecklistAndTeam(checklistId, teamScrumId);
            
            return qualifications.stream().map(ChecklistQualificationMap.INSTANCE::EntityToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new CustomException("Error retrieving qualifications: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public ChecklistQualificationDto add(ChecklistQualificationDto checklistQualificationDto) {
        try {
            ChecklistQualification checklistQualification = new ChecklistQualification();
            ChecklistQualificationMap.INSTANCE.updateChecklistQualification(checklistQualificationDto, checklistQualification);
            ChecklistQualification savedChecklistQualification = checklistQualificationService.save(checklistQualification);
            return ChecklistQualificationMap.INSTANCE.EntityToDTO(savedChecklistQualification);
        } catch (Exception e) {
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void update(Long checklistQualificationId, ChecklistQualificationDto checklistQualificationDto) {
        try {
            checklistQualificationDto.setId(checklistQualificationId);
            ChecklistQualification checklistQualification = checklistQualificationService.getById(checklistQualificationId);
            ChecklistQualificationMap.INSTANCE.updateChecklistQualification(checklistQualificationDto, checklistQualification);
            checklistQualificationService.save(checklistQualification);
        } catch (Exception e) {
            throw new CustomException("Error Updating ChecklistQualification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void delete(Long id) {
        try {
            ChecklistQualification checklistQualification = checklistQualificationService.getById(id);
            checklistQualificationService.delete(checklistQualification);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting ChecklistQualification: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
