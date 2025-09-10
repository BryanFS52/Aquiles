package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.Evaluations;
import com.api.aquilesApi.Entity.Item;
import com.api.aquilesApi.Entity.ItemType;
import com.api.aquilesApi.Repository.ItemTypeRepository;
import com.api.aquilesApi.Repository.JuriesRepository;
import com.api.aquilesApi.Service.ChecklistExportService;
import com.api.aquilesApi.Service.ChecklistService;
import com.api.aquilesApi.Service.EvaluationsService;
import com.api.aquilesApi.Service.ItemService;
import com.api.aquilesApi.Service.TrainingProjectService;
import com.api.aquilesApi.Utilities.CustomException;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.List;

@Service
public class ChecklistBusiness {

    private final ChecklistService checklistService;
    private final ModelMapper modelMapper;
    private final EvaluationsService evaluationsService;
    private final ChecklistExportService exportService;
    private final ChecklistHistoryBusiness checklistHistoryBusiness;
    private final ItemTypeRepository itemTypeRepository;
    private final ItemService itemService; // ← Agregar el servicio de items
    private final TrainingProjectService trainingProjectService;

    public ChecklistBusiness(
            ChecklistService checklistService,
            JuriesRepository juriesRepository,
            ModelMapper modelMapper,
            EvaluationsService evaluationService, EvaluationsService evaluationsService,
            ChecklistExportService exportService,
            ChecklistHistoryBusiness checklistHistoryBusiness,
            ItemTypeRepository itemTypeRepository,
            ItemService itemService, // ← Agregar parámetro
            TrainingProjectService trainingProjectService
    ) {
        this.checklistService = checklistService;
        this.modelMapper = modelMapper;
        this.evaluationsService = evaluationsService;
        this.exportService = exportService;
        this.checklistHistoryBusiness = checklistHistoryBusiness;
        this.itemTypeRepository = itemTypeRepository;
        this.itemService = itemService; // ← Asignar dependencia
        this.trainingProjectService = trainingProjectService;
    }   

    // Find All
    public Page<ChecklistDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Checklist> checklistEntityPage = checklistService.findAll(pageRequest);

            System.out.println("Total Checklist: " + checklistEntityPage.getTotalElements());

            checklistEntityPage.forEach(entity -> {
                if (entity.getInstructorSignature() != null) {
                    int dummy = entity.getInstructorSignature().length;
                }
            });

            return checklistEntityPage.map(entity -> {
                ChecklistDto dto = modelMapper.map(entity, ChecklistDto.class);
                dto.setTrimester(entity.getTrimester());
                dto.setComponent(entity.getComponent());
                dto.setTrainingProjectId(entity.getTrainingProjectId());
                
                // Enriquecer con el nombre del proyecto formativo si no está presente
                if (entity.getTrainingProjectId() != null) {
                    String projectName = entity.getTrainingProjectName();
                    if (projectName == null || projectName.trim().isEmpty()) {
                        try {
                            projectName = trainingProjectService.getTrainingProjectName(entity.getTrainingProjectId());
                            if (projectName != null) {
                                // Actualizar la entidad con el nombre obtenido para futuras consultas
                                entity.setTrainingProjectName(projectName);
                                // No necesitamos save aquí ya que es solo para la consulta actual
                            }
                        } catch (Exception e) {
                            System.err.println("Warning: Could not fetch training project name for ID " + 
                                             entity.getTrainingProjectId() + ": " + e.getMessage());
                        }
                    }
                    dto.setTrainingProjectName(projectName);
                } else {
                    dto.setTrainingProjectName(entity.getTrainingProjectName());
                }
                
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
                int dummy = checklist.getInstructorSignature().length;
            }
            ChecklistDto dto = modelMapper.map(checklist, ChecklistDto.class);
            dto.setTrimester(checklist.getTrimester());
            dto.setComponent(checklist.getComponent());
            dto.setTrainingProjectId(checklist.getTrainingProjectId());
            
            // Enriquecer con el nombre del proyecto formativo si no está presente
            if (checklist.getTrainingProjectId() != null) {
                String projectName = checklist.getTrainingProjectName();
                if (projectName == null || projectName.trim().isEmpty()) {
                    try {
                        projectName = trainingProjectService.getTrainingProjectName(checklist.getTrainingProjectId());
                        if (projectName != null) {
                            // Actualizar la entidad para futuras consultas
                            checklist.setTrainingProjectName(projectName);
                            checklistService.save(checklist); // Guardar el nombre para evitar consultas futuras
                        }
                    } catch (Exception e) {
                        System.err.println("Warning: Could not fetch training project name for ID " + 
                                         checklist.getTrainingProjectId() + ": " + e.getMessage());
                    }
                }
                dto.setTrainingProjectName(projectName);
            } else {
                dto.setTrainingProjectName(checklist.getTrainingProjectName());
            }
            
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
            // Paso 1: crear checklist manualmente para evitar problemas con el mapeo de items
            Checklist checklist = new Checklist();
            checklist.setState(checklistDto.getState());
            checklist.setRemarks(checklistDto.getRemarks());
            checklist.setTrimester(checklistDto.getTrimester());
            checklist.setComponent(checklistDto.getComponent());
            checklist.setEvaluationCriteria(checklistDto.isEvaluationCriteria());
            checklist.setStudySheets(checklistDto.getStudySheets());
            checklist.setTrainingProjectId(checklistDto.getTrainingProjectId());
            
            // Si no se proporciona el nombre del proyecto pero sí el ID, intentar obtenerlo
            if (checklistDto.getTrainingProjectId() != null) {
                String projectName = checklistDto.getTrainingProjectName();
                if (projectName == null || projectName.trim().isEmpty()) {
                    try {
                        projectName = trainingProjectService.getTrainingProjectName(checklistDto.getTrainingProjectId());
                    } catch (Exception e) {
                        System.err.println("Warning: Could not fetch training project name for ID " + 
                                         checklistDto.getTrainingProjectId() + ": " + e.getMessage());
                    }
                }
                checklist.setTrainingProjectName(projectName);
            } else {
                checklist.setTrainingProjectName(checklistDto.getTrainingProjectName());
            }

            // 🔧 Conversión manual del String a byte[] para instructorSignature
            if (checklistDto.getInstructorSignature() != null) {
                checklist.setInstructorSignature(
                    checklistDto.getInstructorSignature().getBytes(java.nio.charset.StandardCharsets.UTF_8)
                );
            }

            // Paso 2: asignar manualmente la entidad Evaluations si se proporciona un ID válido
            // Paso 2: asignar manualmente la entidad Evaluation si se proporciona un ID válido
            if (checklistDto.getEvaluation() != null && checklistDto.getEvaluation().getId() != null) {
                try {
                    Evaluations eval = evaluationsService.getById(checklistDto.getEvaluation().getId());
                    checklist.setEvaluation(eval);
                } catch (Exception e) {
                    System.out.println("Warning: Evaluation with ID " + checklistDto.getEvaluation().getId() + " not found. Continuing without evaluation.");
                }
            }


            // Paso 3: guardar el checklist primero
            Checklist saved = checklistService.save(checklist);
            
            // Paso 4: crear los items si se proporcionan
            if (checklistDto.getItems() != null && !checklistDto.getItems().isEmpty()) {
                // Obtener o crear un ItemType por defecto para este trimestre
                ItemType defaultItemType = getOrCreateDefaultItemType(saved.getTrimester());
                
                // Inicializar la lista de items si es null
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
                    
                    // Agregar el item a la lista del checklist
                    saved.getItems().add(item);
                }
                
                // Volver a guardar para persistir los items
                saved = checklistService.save(saved);
            }
            
            // ⭐ GUARDAR HISTORIAL DE CREACIÓN
            checklistHistoryBusiness.guardarHistorial(
                "Checklist creado", 
                null, 
                saved, 
                "Sistema" // Puedes cambiar esto por el usuario actual
            );
            
            ChecklistDto result = modelMapper.map(saved, ChecklistDto.class);
            // Mapeo manual de los campos que pueden no estar mapeándose correctamente
            result.setTrimester(saved.getTrimester());
            result.setComponent(saved.getComponent());
            result.setTrainingProjectId(saved.getTrainingProjectId());
            result.setTrainingProjectName(saved.getTrainingProjectName());
            return result;
        } catch (Exception e) {
            throw new CustomException("Error creating checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update
    public void update(Long checklistId, ChecklistDto checklistDto) {
        try {
            // ⭐ OBTENER EL ESTADO ANTES DE LA ACTUALIZACIÓN
            Checklist checklistAntes = checklistService.getById(checklistId);
            
            // Crear una copia del estado anterior para el historial
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

            // Aplicar los cambios básicos del checklist
            checklistAntes.setState(checklistDto.getState());
            checklistAntes.setRemarks(checklistDto.getRemarks());
            checklistAntes.setStudySheets(checklistDto.getStudySheets());
            checklistAntes.setEvaluationCriteria(checklistDto.isEvaluationCriteria());
            
            // ✅ AGREGAR ACTUALIZACIÓN DE TRIMESTER Y COMPONENT
            if (checklistDto.getTrimester() != null) {
                checklistAntes.setTrimester(checklistDto.getTrimester());
            }
            if (checklistDto.getComponent() != null) {
                checklistAntes.setComponent(checklistDto.getComponent());
            }
            if (checklistDto.getTrainingProjectId() != null) {
                checklistAntes.setTrainingProjectId(checklistDto.getTrainingProjectId());
            }
            // Manejar actualización del proyecto formativo y su nombre
            if (checklistDto.getTrainingProjectId() != null) {
                checklistAntes.setTrainingProjectId(checklistDto.getTrainingProjectId());
                
                // Si no se proporciona el nombre pero sí el ID, intentar obtenerlo
                String projectName = checklistDto.getTrainingProjectName();
                if (projectName == null || projectName.trim().isEmpty()) {
                    try {
                        projectName = trainingProjectService.getTrainingProjectName(checklistDto.getTrainingProjectId());
                    } catch (Exception e) {
                        System.err.println("Warning: Could not fetch training project name for ID " + 
                                         checklistDto.getTrainingProjectId() + ": " + e.getMessage());
                    }
                }
                checklistAntes.setTrainingProjectName(projectName);
            } else if (checklistDto.getTrainingProjectName() != null) {
                checklistAntes.setTrainingProjectName(checklistDto.getTrainingProjectName());
            }

            if (checklistDto.getInstructorSignature() != null) {
                checklistAntes.setInstructorSignature(
                    checklistDto.getInstructorSignature().getBytes(StandardCharsets.UTF_8)
                );
            }

            // 🔗 VINCULAR EVALUACIÓN SI SE PROPORCIONA evaluationId
            if (checklistDto.getEvaluation() != null) {
                try {
                    Evaluations evaluation = evaluationsService.getById(checklistDto.getEvaluation().getId());
                    checklistAntes.setEvaluation(evaluation);
                    System.out.println("✅ Linked evaluation ID: " + checklistDto.getEvaluation() + " to checklist");
                } catch (Exception e) {
                    System.err.println("❌ Error linking evaluation: " + e.getMessage());
                    // No lanzamos excepción para que el resto de la actualización continúe
                }
            }

            // 🔧 ACTUALIZAR ITEMS - ESTA ERA LA PARTE FALTANTE
            if (checklistDto.getItems() != null) {
                // Obtener los items existentes
                List<Item> existingItems = checklistAntes.getItems();
                if (existingItems == null) {
                    existingItems = new java.util.ArrayList<>();
                    checklistAntes.setItems(existingItems);
                }

                // 🗑️ ELIMINAR ITEMS MARCADOS PARA ELIMINACIÓN
                if (checklistDto.getDeletedItemIds() != null && !checklistDto.getDeletedItemIds().isEmpty()) {
                    System.out.println("🗑️ Processing item deletions: " + checklistDto.getDeletedItemIds());
                    
                    Iterator<Item> iterator = existingItems.iterator();
                    while (iterator.hasNext()) {
                        Item item = iterator.next();
                        if (checklistDto.getDeletedItemIds().contains(item.getId())) {
                            System.out.println("🗑️ Deleting item ID: " + item.getId() + " - '" + item.getIndicator() + "'");
                            iterator.remove();
                            // Eliminar también de la base de datos si es necesario
                            try {
                                itemService.delete(item);
                                System.out.println("✅ Item deleted from database");
                            } catch (Exception e) {
                                System.err.println("❌ Error deleting item from database: " + e.getMessage());
                            }
                        }
                    }
                }

                // Actualizar items existentes o crear nuevos
                for (var itemDto : checklistDto.getItems()) {
                    Item existingItem = null;
                    
                    // Si el itemDto tiene ID, buscar el item existente
                    if (itemDto.getId() != null) {
                        for (Item item : existingItems) {
                            if (item.getId().equals(itemDto.getId())) {
                                existingItem = item;
                                break;
                            }
                        }
                    }
                    
                    if (existingItem != null) {
                        // 🎯 ACTUALIZAR ITEM EXISTENTE
                        System.out.println("🔄 Updating existing item ID: " + existingItem.getId() + 
                                         " from '" + existingItem.getIndicator() + 
                                         "' to '" + itemDto.getIndicator() + "'");
                        existingItem.setCode(itemDto.getCode());
                        existingItem.setIndicator(itemDto.getIndicator());
                        existingItem.setActive(itemDto.getActive() != null ? itemDto.getActive() : true);
                    } else {
                        // ➕ CREAR NUEVO ITEM
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

            // ✅ Modificar la evaluación ya existente asociada al checklist
            Evaluations eval = checklistAntes.getEvaluation();
            if (eval != null) {
                eval.setValueJudgment("Nuevo juicio de valor");
                eval.setObservations("Observaciones actualizadas");
                // Modifica aquí lo que necesites
            }

            // Guardar los cambios (esto persistirá tanto el checklist como los items actualizados)
            System.out.println("💾 Saving updated checklist with items...");
            Checklist checklistActualizado = checklistService.save(checklistAntes);
            System.out.println("✅ Checklist saved successfully with " + checklistActualizado.getItems().size() + " items");

            // ⭐ GUARDAR HISTORIAL DE ACTUALIZACIÓN
            checklistHistoryBusiness.guardarHistorial(
                "Checklist actualizado", 
                estadoAnterior, 
                checklistActualizado, 
                "Sistema" // Puedes cambiar esto por el usuario actual
            );

        } catch (Exception e) {
            System.err.println("❌ Error updating checklist: " + e.getMessage());
            e.printStackTrace();
            throw new CustomException("Error Updating Checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete
    public void delete(Long attendanceId) {
        try {
            // ⭐ OBTENER EL CHECKLIST ANTES DE ELIMINARLO
            Checklist checklistAntes = checklistService.getById(attendanceId);
            
            // Eliminar el checklist
            checklistService.delete(checklistAntes);
            
            // ⭐ GUARDAR HISTORIAL DE ELIMINACIÓN
            checklistHistoryBusiness.guardarHistorial(
                "Checklist eliminado", 
                checklistAntes, 
                null, 
                "Sistema" // Puedes cambiar esto por el usuario actual
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
        // Intentar obtener un ItemType existente para el trimestre
        List<ItemType> existingTypes = itemTypeRepository.findAll();
        
        // Buscar un ItemType que coincida con el trimestre
        for (ItemType itemType : existingTypes) {
            if (trimester.equals(itemType.getTrimester())) {
                return itemType;
            }
        }
        
        // Si no hay ninguno para este trimestre, crear uno nuevo
        ItemType newItemType = new ItemType();
        newItemType.setName("Default");
        newItemType.setTrimester(trimester);
        return itemTypeRepository.save(newItemType);
    }
}