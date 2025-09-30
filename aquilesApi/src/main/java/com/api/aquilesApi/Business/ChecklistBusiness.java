package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.Evaluations;
import com.api.aquilesApi.Entity.Item;
import com.api.aquilesApi.Entity.ItemType;
import com.api.aquilesApi.Repository.ItemTypeRepository;
import com.api.aquilesApi.Repository.JuriesRepository;
import com.api.aquilesApi.Service.*;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.List;

@Component
public class ChecklistBusiness {

    private final ChecklistService checklistService;
    private final ModelMapper modelMapper;
    private final EvaluationsService evaluationsService;
    private final ChecklistExportService exportService;
    private final ChecklistHistoryBusiness checklistHistoryBusiness;
    private final ItemTypeRepository itemTypeRepository;
    private final ItemService itemService;

    public ChecklistBusiness(
            ChecklistService checklistService,
            JuriesRepository juriesRepository,
            ModelMapper modelMapper,
            EvaluationsService evaluationsService,
            ChecklistExportService exportService,
            ChecklistHistoryBusiness checklistHistoryBusiness,
            ItemTypeRepository itemTypeRepository,
            ItemService itemService
    ) {
        this.checklistService = checklistService;
        this.modelMapper = modelMapper;
        this.evaluationsService = evaluationsService;
        this.exportService = exportService;
        this.checklistHistoryBusiness = checklistHistoryBusiness;
        this.itemTypeRepository = itemTypeRepository;
        this.itemService = itemService;
    }

    // Find All
    public Page<ChecklistDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Checklist> checklistEntityPage = checklistService.findAll(pageRequest);

            System.out.println("Total Checklist: " + checklistEntityPage.getTotalElements());

            checklistEntityPage.forEach(entity -> {
                if (entity.getInstructorSignature() != null) {
                    // Firma presente
                }
            });

            return checklistEntityPage.map(entity -> {
                ChecklistDto dto = modelMapper.map(entity, ChecklistDto.class);
                dto.setTrimester(entity.getTrimester());
                dto.setComponent(entity.getComponent());
                dto.setTrainingProjectId(entity.getTrainingProjectId());
                return dto;
            });
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
            if (checklist.getInstructorSignature() != null) {
                // Firma presente
            }
            ChecklistDto dto = modelMapper.map(checklist, ChecklistDto.class);
            dto.setTrimester(checklist.getTrimester());
            dto.setComponent(checklist.getComponent());
            dto.setTrainingProjectId(checklist.getTrainingProjectId());
            return dto;
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Getting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Add
    public ChecklistDto add(ChecklistDto checklistDto) {
        try {
            Checklist checklist = new Checklist();
            checklist.setState(checklistDto.getState());
            checklist.setRemarks(checklistDto.getRemarks());
            checklist.setTrimester(checklistDto.getTrimester());
            checklist.setComponent(checklistDto.getComponent());
            checklist.setEvaluationCriteria(checklistDto.isEvaluationCriteria());
            checklist.setStudySheets(checklistDto.getStudySheets());
            checklist.setTrainingProjectId(checklistDto.getTrainingProjectId());

            // Conversión manual del String a byte[] para instructorSignature
            if (checklistDto.getInstructorSignature() != null) {
                checklist.setInstructorSignature(
                        checklistDto.getInstructorSignature().getBytes(java.nio.charset.StandardCharsets.UTF_8)
                );
            }

            // Asignar manualmente la entidad Evaluations si se proporciona un ID válido
            if (checklistDto.getEvaluation() != null && checklistDto.getEvaluation().getId() != null) {
                try {
                    Evaluations eval = evaluationsService.getById(checklistDto.getEvaluation().getId());
                    checklist.setEvaluation(eval);
                } catch (Exception e) {
                    System.out.println("Warning: Evaluation with ID " + checklistDto.getEvaluation().getId() + " not found. Continuing without evaluation.");
                }
            }

            Checklist saved = checklistService.save(checklist);

            // Crear los items si se proporcionan
            if (checklistDto.getItems() != null && !checklistDto.getItems().isEmpty()) {
                ItemType defaultItemType = getOrCreateDefaultItemType(saved.getTrimester());
                if (saved.getItems() == null) {
                    saved.setItems(new java.util.ArrayList<>());
                }
                for (var itemDto : checklistDto.getItems()) {
                    Item item = new Item();
                    item.setCode(itemDto.getCode());
                    item.setIndicator(itemDto.getIndicator());
                    item.setActive(itemDto.getActive() != null ? itemDto.getActive() : true);
                    item.setChecklist(saved);
                    item.setItemType(defaultItemType);
                    saved.getItems().add(item);
                }
                saved = checklistService.save(saved);
            }

            checklistHistoryBusiness.guardarHistorial(
                    "Checklist creado",
                    null,
                    saved,
                    "Sistema"
            );

            ChecklistDto result = modelMapper.map(saved, ChecklistDto.class);
            result.setTrimester(saved.getTrimester());
            result.setComponent(saved.getComponent());
            result.setTrainingProjectId(saved.getTrainingProjectId());
            return result;
        } catch (Exception e) {
            throw new CustomException("Error creating checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long checklistId, ChecklistDto checklistDto) {
        try {
            Checklist checklistAntes = checklistService.getById(checklistId);
            Checklist estadoAnterior = new Checklist();
            estadoAnterior.setId(checklistAntes.getId());
            estadoAnterior.setState(checklistAntes.getState());
            estadoAnterior.setRemarks(checklistAntes.getRemarks());
            estadoAnterior.setStudySheets(checklistAntes.getStudySheets());
            estadoAnterior.setEvaluationCriteria(checklistAntes.isEvaluationCriteria());
            estadoAnterior.setInstructorSignature(checklistAntes.getInstructorSignature());
            estadoAnterior.setDateAssigned(checklistAntes.getDateAssigned());
            estadoAnterior.setEvaluation(checklistAntes.getEvaluation());
            estadoAnterior.setLearningOutcome(checklistAntes.getLearningOutcome());

            checklistAntes.setState(checklistDto.getState());
            checklistAntes.setRemarks(checklistDto.getRemarks());
            checklistAntes.setStudySheets(checklistDto.getStudySheets());
            checklistAntes.setEvaluationCriteria(checklistDto.isEvaluationCriteria());
            if (checklistDto.getTrimester() != null) {
                checklistAntes.setTrimester(checklistDto.getTrimester());
            }
            if (checklistDto.getComponent() != null) {
                checklistAntes.setComponent(checklistDto.getComponent());
            }
            if (checklistDto.getTrainingProjectId() != null) {
                checklistAntes.setTrainingProjectId(checklistDto.getTrainingProjectId());
            }
            if (checklistDto.getInstructorSignature() != null) {
                checklistAntes.setInstructorSignature(
                        checklistDto.getInstructorSignature().getBytes(StandardCharsets.UTF_8)
                );
            }
            if (checklistDto.getEvaluation() != null) {
                try {
                    Evaluations evaluation = evaluationsService.getById(checklistDto.getEvaluation().getId());
                    checklistAntes.setEvaluation(evaluation);
                    System.out.println("✅ Linked evaluation ID: " + checklistDto.getEvaluation() + " to checklist");
                } catch (Exception e) {
                    System.err.println("❌ Error linking evaluation: " + e.getMessage());
                }
            }
            if (checklistDto.getItems() != null) {
                List<Item> existingItems = checklistAntes.getItems();
                if (existingItems == null) {
                    existingItems = new java.util.ArrayList<>();
                    checklistAntes.setItems(existingItems);
                }
                if (checklistDto.getDeletedItemIds() != null && !checklistDto.getDeletedItemIds().isEmpty()) {
                    System.out.println("🗑️ Processing item deletions: " + checklistDto.getDeletedItemIds());
                    Iterator<Item> iterator = existingItems.iterator();
                    while (iterator.hasNext()) {
                        Item item = iterator.next();
                        if (checklistDto.getDeletedItemIds().contains(item.getId())) {
                            System.out.println("🗑️ Deleting item ID: " + item.getId() + " - '" + item.getIndicator() + "'");
                            iterator.remove();
                            try {
                                itemService.delete(item);
                                System.out.println("✅ Item deleted from database");
                            } catch (Exception e) {
                                System.err.println("❌ Error deleting item from database: " + e.getMessage());
                            }
                        }
                    }
                }
                for (var itemDto : checklistDto.getItems()) {
                    Item existingItem = null;
                    if (itemDto.getId() != null) {
                        for (Item item : existingItems) {
                            if (item.getId().equals(itemDto.getId())) {
                                existingItem = item;
                                break;
                            }
                        }
                    }
                    if (existingItem != null) {
                        System.out.println("🔄 Updating existing item ID: " + existingItem.getId() +
                                " from '" + existingItem.getIndicator() +
                                "' to '" + itemDto.getIndicator() + "'");
                        existingItem.setCode(itemDto.getCode());
                        existingItem.setIndicator(itemDto.getIndicator());
                        existingItem.setActive(itemDto.getActive() != null ? itemDto.getActive() : true);
                    } else {
                        System.out.println("➕ Creating new item: " + itemDto.getIndicator());
                        ItemType defaultItemType = getOrCreateDefaultItemType(checklistAntes.getTrimester());
                        Item newItem = new Item();
                        newItem.setCode(itemDto.getCode());
                        newItem.setIndicator(itemDto.getIndicator());
                        newItem.setActive(itemDto.getActive() != null ? itemDto.getActive() : true);
                        newItem.setChecklist(checklistAntes);
                        newItem.setItemType(defaultItemType);
                        existingItems.add(newItem);
                    }
                }
            }
            Evaluations eval = checklistAntes.getEvaluation();
            if (eval != null) {
                eval.setValueJudgment("Nuevo juicio de valor");
                eval.setObservations("Observaciones actualizadas");
            }
            System.out.println("💾 Saving updated checklist with items...");
            Checklist checklistActualizado = checklistService.save(checklistAntes);
            System.out.println("✅ Checklist saved successfully with " + checklistActualizado.getItems().size() + " items");
            checklistHistoryBusiness.guardarHistorial(
                    "Checklist actualizado",
                    estadoAnterior,
                    checklistActualizado,
                    "Sistema"
            );
        } catch (Exception e) {
            System.err.println("❌ Error updating checklist: " + e.getMessage());
            // Se recomienda usar un logger en vez de printStackTrace
            throw new CustomException("Error Updating Checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long attendanceId) {
        try {
            Checklist checklistAntes = checklistService.getById(attendanceId);
            checklistService.delete(checklistAntes);
            checklistHistoryBusiness.guardarHistorial(
                    "Checklist eliminado",
                    checklistAntes,
                    null,
                    "Sistema"
            );
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException("Error Deleting Attendance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Export documents
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

    // Helper method to get or create default ItemType
    private ItemType getOrCreateDefaultItemType(String trimester) {
        List<ItemType> existingTypes = itemTypeRepository.findAll();
        for (ItemType itemType : existingTypes) {
            if (trimester.equals(itemType.getTrimester())) {
                return itemType;
            }
        }
        ItemType newItemType = new ItemType();
        newItemType.setName("Default");
        newItemType.setTrimester(trimester);
        return itemTypeRepository.save(newItemType);
    }
}
