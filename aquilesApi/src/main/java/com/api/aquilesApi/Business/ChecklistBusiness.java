package com.api.aquilesApi.Business;

import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.ItemType;
import com.api.aquilesApi.Service.ChecklistService;
import com.api.aquilesApi.Service.ItemTypeService;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Utilities.Mapper.ChecklistMap;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Business logic para la gestión de Listas de Chequeo
 *
 * FLUJO DE VIDA DE UNA LISTA DE CHEQUEO:
 * ========================================
 *
 * 1. CREACIÓN (Coordinador):
 *    - Crea la lista de chequeo con items (indicadores técnicos/actitudinales)
 *    - Define: trimestre, componente, proyecto formativo, fichas asociadas
 *    - Campos que PUEDEN ser NULL: remarks, instructorSignature, evaluationCriteria, evaluation
 *    - Estado inicial: state = true (activa)
 *
 * 2. VISUALIZACIÓN (Instructor):
 *    - Instructor ve listas activas asignadas a sus fichas (studySheets)
 *    - Puede ver los items a evaluar
 *    - No puede ver campos de calificación porque aún son NULL
 *
 * 3. CALIFICACIÓN (Instructor):
 *    - Instructor evalúa cada item (activo: true/false)
 *    - Completa: remarks (observaciones), instructorSignature (firma digital)
 *    - Actualiza: evaluationCriteria (criterios cumplidos)
 *    - Crea relación con Evaluation (1:1)
 *
 * 4. CONSULTA (Coordinador/Instructor):
 *    - Ambos pueden ver la lista completa con la calificación
 *    - Histórico se guarda en ChecklistHistory
 */
@Component
public class ChecklistBusiness {

    private final ChecklistService checklistService;
    private final ItemTypeService itemTypeService;

    public ChecklistBusiness(ChecklistService checklistService, ItemTypeService itemTypeService) {
        this.checklistService = checklistService;
        this.itemTypeService = itemTypeService;
    }

    // Get all Checklists (Paginated)
    public Page<ChecklistDto> findAll(int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Checklist> checklistPage = checklistService.findAll(pageRequest);
            return ChecklistMap.INSTANCE.EntityToDTOs(checklistPage);
        } catch (DataAccessException e) {
            throw new CustomException("Error retrieving checklists due to data access issues: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new CustomException("An unexpected error occurred while retrieving checklist. " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Checklist by ID
    public ChecklistDto findById(Long id) {
        try {
            Checklist checklist = checklistService.getById(id);
            return ChecklistMap.INSTANCE.EntityToDTO(checklist);
        } catch (CustomException e) {
            throw e;
        } catch (Exception e){
            throw new CustomException("Error Getting Checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Crea una nueva Lista de Chequeo (ROL: COORDINADOR)
     *
     * Campos OBLIGATORIOS al crear:
     * - state (true = activa)
     * - trimester
     * - items (lista de indicadores)
     * - studySheets (fichas asociadas)
     *
     * Campos OPCIONALES (se llenan cuando el instructor califica):
     * - remarks
     * - instructorSignature
     * - evaluationCriteria
     * - evaluation
     */
    public ChecklistDto add(ChecklistDto checklistDto) {
        try {
            // Validaciones de creación (Coordinador)
            validateChecklistCreation(checklistDto);

            Checklist checklist = new Checklist();
            ChecklistMap.INSTANCE.updateChecklist(checklistDto, checklist);

            // Establecer relación bidireccional con Items y validar ItemTypes
            if (checklist.getItems() != null) {
                checklist.getItems().forEach(item -> {
                    // Validar y establecer ItemType desde la base de datos
                    if (item.getItemType() != null && item.getItemType().getId() != null) {
                        ItemType itemType = itemTypeService.getById(item.getItemType().getId());
                        item.setItemType(itemType);
                    } else {
                        throw new CustomException("ItemType es obligatorio para cada item", HttpStatus.BAD_REQUEST);
                    }
                    // Establecer relación bidireccional con Checklist
                    item.setChecklist(checklist);
                });
            }

            Checklist savedChecklist = checklistService.save(checklist);
            return ChecklistMap.INSTANCE.EntityToDTO(savedChecklist);
        } catch (CustomException e) {
            throw e;
        } catch (DataAccessException e) {
            // Detectar error de longitud de campo excedida
            String errorMessage = e.getMessage().toLowerCase();
            if (errorMessage.contains("demasiado largo") ||
                    errorMessage.contains("too long") ||
                    errorMessage.contains("character varying")) {
                // Extraer el límite de caracteres del mensaje
                String limit = "especificado";
                if (errorMessage.contains("varying(")) {
                    try {
                        int start = errorMessage.indexOf("varying(") + 8;
                        int end = errorMessage.indexOf(")", start);
                        limit = errorMessage.substring(start, end);
                    } catch (Exception ex) {
                        // Si no se puede extraer, usar mensaje genérico
                    }
                }
                throw new CustomException(
                        "Uno de los campos (indicador técnico o actitudinal) excede el límite de " + limit + " caracteres permitidos. " +
                                "Por favor, reduzca el texto e intente nuevamente.",
                        HttpStatus.BAD_REQUEST
                );
            }
            throw new CustomException("Error al crear la Lista de Chequeo: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            throw new CustomException("Error creating checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Actualiza una lista de chequeo existente
     *
     * IMPORTANTE: Solo se actualizan los campos que vienen en el DTO (no-null)
     * Permite dos tipos de actualización:
     * - COORDINADOR: para editar datos generales (trimestre, items, etc)
     * - INSTRUCTOR: para completar la calificación (remarks, signature, evaluation)
     */
    public void update(Long checklistId, ChecklistDto checklistDto) {
        try {
            checklistDto.setId(checklistId);
            Checklist checklist = checklistService.getById(checklistId);

            // ✅ Guardar items actuales antes de mapear
            var currentItems = checklist.getItems();

            // Actualizar campos desde el DTO (MapStruct ignora valores null gracias a NullValuePropertyMappingStrategy.IGNORE)
            ChecklistMap.INSTANCE.updateChecklist(checklistDto, checklist);

            // ✅ Si el DTO no trae items, restaurar los items originales
            if (checklistDto.getItems() == null || checklistDto.getItems().isEmpty()) {
                checklist.setItems(currentItems);
            } else {
                // ✅ Si el DTO trae items, validar los ItemTypes y actualizar relaciones
                for (var item : checklist.getItems()) {
                    // Validar que el ItemType existe en la base de datos
                    ItemType itemType = itemTypeService.getById(item.getItemType().getId());
                    item.setItemType(itemType);

                    // Establecer la relación bidireccional
                    item.setChecklist(checklist);
                }
            }

            checklistService.save(checklist);
        } catch (CustomException e) {
            throw e;
        } catch (DataAccessException e) {
            // Detectar error de longitud de campo excedida
            String errorMessage = e.getMessage().toLowerCase();
            if (errorMessage.contains("demasiado largo") ||
                    errorMessage.contains("too long") ||
                    errorMessage.contains("character varying")) {
                // Extraer el límite de caracteres del mensaje
                String limit = "especificado";
                if (errorMessage.contains("varying(")) {
                    try {
                        int start = errorMessage.indexOf("varying(") + 8;
                        int end = errorMessage.indexOf(")", start);
                        limit = errorMessage.substring(start, end);
                    } catch (Exception ex) {
                        // Si no se puede extraer, usar mensaje genérico
                    }
                }
                throw new CustomException(
                        "Uno de los campos (indicador técnico o actitudinal) excede el límite de " + limit + " caracteres permitidos. " +
                                "Por favor, reduzca el texto e intente nuevamente.",
                        HttpStatus.BAD_REQUEST
                );
            }
            // Detectar error de violación de clave foránea
            if (errorMessage.contains("foreign key") ||
                    errorMessage.contains("llave foránea") ||
                    errorMessage.contains("checklist_qualifications") ||
                    errorMessage.contains("constraint")) {
                throw new CustomException(
                        "No se puede actualizar esta Lista de Chequeo porque ya ha sido evaluada por un instructor. " +
                                "Los items no pueden ser modificados una vez que existen calificaciones asociadas.",
                        HttpStatus.CONFLICT
                );
            }
            throw new CustomException("Error al actualizar la Lista de Chequeo: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            throw new CustomException("Error Updating Checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete Checklist by ID
    public void delete(Long checklistId) {
        try {
            Checklist checklist = checklistService.getById(checklistId);
            checklistService.delete(checklist);
        } catch (CustomException e) {
            throw e;
        } catch (DataAccessException e) {
            // Detectar error de violación de clave foránea
            String errorMessage = e.getMessage().toLowerCase();
            if (errorMessage.contains("foreign key") ||
                    errorMessage.contains("llave foránea") ||
                    errorMessage.contains("checklist_qualifications") ||
                    errorMessage.contains("evaluations") ||
                    errorMessage.contains("constraint") ||
                    errorMessage.contains("referida desde")) {
                throw new CustomException(
                        "No se puede eliminar esta Lista de Chequeo porque ya ha sido evaluada por un instructor. " +
                                "Las listas con calificaciones o evaluaciones asociadas no pueden ser eliminadas.",
                        HttpStatus.CONFLICT
                );
            }
            throw new CustomException("Error al eliminar la Lista de Chequeo: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            throw new CustomException("Error Deleting Checklist: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Validaciones específicas para la creación de una lista de chequeo
     * (Coordinador)
     */
    private void validateChecklistCreation(ChecklistDto dto) {
        if (dto.getState() == null) {
            throw new CustomException("El estado de la lista de chequeo es obligatorio", HttpStatus.BAD_REQUEST);
        }

        if (dto.getTrimester() == null || dto.getTrimester().trim().isEmpty()) {
            throw new CustomException("El trimestre es obligatorio", HttpStatus.BAD_REQUEST);
        }

        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new CustomException("Debe agregar al menos un item (indicador) a la lista de chequeo", HttpStatus.BAD_REQUEST);
        }

        if (dto.getStudySheets() == null || dto.getStudySheets().trim().isEmpty()) {
            throw new CustomException("Debe asociar al menos una ficha de formación", HttpStatus.BAD_REQUEST);
        }
    }
}