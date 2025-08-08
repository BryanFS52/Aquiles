package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Repository.ChecklistRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import com.api.aquilesApi.Business.ChecklistHistoryBusiness;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ChecklistService implements Idao<Checklist, Long> {

    private final ChecklistRepository checklistRepository;
    private final ChecklistHistoryBusiness checklistHistoryBusiness;

    public ChecklistService(
            ChecklistRepository checklistRepository,
            ChecklistHistoryBusiness checklistHistoryBusiness
    ) {
        this.checklistRepository = checklistRepository;
        this.checklistHistoryBusiness = checklistHistoryBusiness;
    }

    @Override
    public Page<Checklist> findAll(PageRequest pageRequest) {
        return checklistRepository.findAll(pageRequest);
    }

    @Override
    public Checklist getById(Long id) {
        return checklistRepository.findById(id).orElseThrow(() ->
                new CustomException("CheckList with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(Checklist entity) {
        Checklist existente = checklistRepository.findById(entity.getId())
                .orElseThrow(() -> new CustomException("Checklist with id " + entity.getId() + " not found", HttpStatus.NO_CONTENT));

        // ⚠️ Usuario responsable (puedes adaptarlo luego con Spring Security)
        String usuario = "sistema";

        // Guardar estado antes de actualizar
        checklistHistoryBusiness.guardarHistorial("UPDATE", existente, null, usuario);

        // Guardar cambios
        checklistRepository.save(entity);

        // Guardar estado después de actualizar
        checklistHistoryBusiness.guardarHistorial("UPDATE", null, entity, usuario);
    }

    @Override
    public Checklist save(Checklist entity) {
        return checklistRepository.save(entity);
    }

    @Override
    public void delete(Checklist entity) {
        // ⚠️ Usuario responsable (puedes adaptarlo luego con Spring Security)
        String usuario = "sistema";

        // Guardar estado antes de borrar
        checklistHistoryBusiness.guardarHistorial("DELETE", entity, null, usuario);

        checklistRepository.delete(entity);
    }

    @Override
    public void create(Checklist entity) {
        Checklist guardado = checklistRepository.save(entity);

        // ⚠️ Usuario responsable (puedes adaptarlo luego con Spring Security)
        String usuario = "sistema";

        // Guardar estado después de crear
        checklistHistoryBusiness.guardarHistorial("CREATE", null, guardado, usuario);
    }
}
