package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ImprovementPlanActivityDto;
import com.api.aquilesApi.Dto.ImprovementPlanEvidenceTypeDto;
import com.api.aquilesApi.Entity.ImprovementPlanActivity;
import com.api.aquilesApi.Entity.ImprovementPlanEvidenceType;
import com.api.aquilesApi.Service.ImprovementPlanActivityService;
import com.api.aquilesApi.Service.ImprovementPlanEvidenceTypeService;
import com.api.aquilesApi.Service.ImprovementPlanService;
import com.api.aquilesApi.Service.ImprovementPlanDeliveryService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.ImprovementPlanActivityMap;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ImprovementPlanActivityBusiness {

    private final ImprovementPlanActivityService improvementPlanActivityService;
    private final ImprovementPlanEvidenceTypeService improvementPlanEvidenceTypeService;
    private final ImprovementPlanService improvementPlanService;
    private final ImprovementPlanDeliveryService improvementPlanDeliveryService;

    public ImprovementPlanActivityBusiness(ImprovementPlanActivityService improvementPlanActivityService,
                                           ImprovementPlanEvidenceTypeService improvementPlanEvidenceTypeService,
                                           ImprovementPlanService improvementPlanService,
                                           ImprovementPlanDeliveryService improvementPlanDeliveryService) {
        this.improvementPlanActivityService = improvementPlanActivityService;
        this.improvementPlanEvidenceTypeService = improvementPlanEvidenceTypeService;
        this.improvementPlanService = improvementPlanService;
        this.improvementPlanDeliveryService = improvementPlanDeliveryService;
    }

    // Get all improvementPlanActivity (Paginated)
    public Page<ImprovementPlanActivityDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ImprovementPlanActivity> improvementPlanActivityPage = improvementPlanActivityService.findAll(pageRequest);
            return ImprovementPlanActivityMap.INSTANCE.EntityToDTOs(improvementPlanActivityPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving ImprovementPlanActivity: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
        throw new CustomException("An unexpected error occurred while retrieving improvementPlanActivities.", HttpStatus.INTERNAL_SERVER_ERROR);
         }
    }

    // Get improvementPlanActivity by ID
    public ImprovementPlanActivityDto findById(Long id) {
        try {
           ImprovementPlanActivity improvementPlanActivity = improvementPlanActivityService.getById(id);
           return ImprovementPlanActivityMap.INSTANCE.EntityToDTO(improvementPlanActivity);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error getting ImprovementPlanActivity: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add new improvementPlanActivity
    public ImprovementPlanActivityDto add(ImprovementPlanActivityDto improvementPlanActivityDto) {
        try {
           ImprovementPlanActivity improvementPlanActivity = new ImprovementPlanActivity();

           // Set basic fields
           improvementPlanActivity.setDescription(improvementPlanActivityDto.getDescription());
           if (improvementPlanActivityDto.getDeliveryDate() != null) {
               improvementPlanActivity.setDeliveryDate(java.time.LocalDate.parse(improvementPlanActivityDto.getDeliveryDate()));
           }

           // Handle ImprovementPlan relationship
           if (improvementPlanActivityDto.getImprovementPlan() != null && improvementPlanActivityDto.getImprovementPlan().getId() != null) {
               improvementPlanActivity.setImprovementPlan(
                   improvementPlanService.getById(improvementPlanActivityDto.getImprovementPlan().getId())
               );
           }

           // Handle ImprovementPlanDelivery relationship
           if (improvementPlanActivityDto.getImprovementPlanDelivery() != null && improvementPlanActivityDto.getImprovementPlanDelivery().getId() != null) {
               improvementPlanActivity.setImprovementPlanDelivery(
                   improvementPlanDeliveryService.getById(improvementPlanActivityDto.getImprovementPlanDelivery().getId())
               );
           }

           // Handle evidenceTypes Many-to-Many relationship
           if (improvementPlanActivityDto.getEvidenceTypes() != null && !improvementPlanActivityDto.getEvidenceTypes().isEmpty()) {
               List<ImprovementPlanEvidenceType> evidenceTypes = new ArrayList<>();
               for (ImprovementPlanEvidenceTypeDto dto : improvementPlanActivityDto.getEvidenceTypes()) {
                   if (dto.getId() != null) {
                       ImprovementPlanEvidenceType evidenceType = improvementPlanEvidenceTypeService.getById(dto.getId());
                       evidenceTypes.add(evidenceType);
                   }
               }
               improvementPlanActivity.setEvidenceTypes(evidenceTypes);
           }

           ImprovementPlanActivity savedImprovementPlanActivity = improvementPlanActivityService.save(improvementPlanActivity);
           return ImprovementPlanActivityMap.INSTANCE.EntityToDTO(savedImprovementPlanActivity);
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update improvementPlanActivity
    public void update(Long improvementPlanId, ImprovementPlanActivityDto improvementPlanActivityDto) {
        try {
            ImprovementPlanActivity improvementPlanActivity = improvementPlanActivityService.getById(improvementPlanId);

            // Update basic fields
            if (improvementPlanActivityDto.getDescription() != null) {
                improvementPlanActivity.setDescription(improvementPlanActivityDto.getDescription());
            }
            if (improvementPlanActivityDto.getDeliveryDate() != null) {
                improvementPlanActivity.setDeliveryDate(java.time.LocalDate.parse(improvementPlanActivityDto.getDeliveryDate()));
            }

            // Update ImprovementPlan relationship
            if (improvementPlanActivityDto.getImprovementPlan() != null && improvementPlanActivityDto.getImprovementPlan().getId() != null) {
                improvementPlanActivity.setImprovementPlan(
                    improvementPlanService.getById(improvementPlanActivityDto.getImprovementPlan().getId())
                );
            }

            // Update ImprovementPlanDelivery relationship
            if (improvementPlanActivityDto.getImprovementPlanDelivery() != null && improvementPlanActivityDto.getImprovementPlanDelivery().getId() != null) {
                improvementPlanActivity.setImprovementPlanDelivery(
                    improvementPlanDeliveryService.getById(improvementPlanActivityDto.getImprovementPlanDelivery().getId())
                );
            }

            // Update evidenceTypes Many-to-Many relationship
            if (improvementPlanActivityDto.getEvidenceTypes() != null) {
                List<ImprovementPlanEvidenceType> evidenceTypes = new ArrayList<>();
                for (ImprovementPlanEvidenceTypeDto dto : improvementPlanActivityDto.getEvidenceTypes()) {
                    if (dto.getId() != null) {
                        ImprovementPlanEvidenceType evidenceType = improvementPlanEvidenceTypeService.getById(dto.getId());
                        evidenceTypes.add(evidenceType);
                    }
                }
                improvementPlanActivity.setEvidenceTypes(evidenceTypes);
            }

            improvementPlanActivityService.save(improvementPlanActivity);
        } catch (Exception e) {
            throw new CustomException("Error updating ImprovementPlanActivity: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete improvementPlanActivity by ID
    public void delete(Long improvementPlanId) {
        try {
            ImprovementPlanActivity improvementPlanActivity = improvementPlanActivityService.getById(improvementPlanId);
            improvementPlanActivityService.delete(improvementPlanActivity);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error deleting ImprovementPlanActivity: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}