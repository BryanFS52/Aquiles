package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ChecklistQualification;
import com.api.aquilesApi.Repository.ChecklistQualificationRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;


@Service
public class ChecklistQualificationService implements Idao<ChecklistQualification, Long> {
    private final ChecklistQualificationRepository checklistQualificationRepository;

    public ChecklistQualificationService(ChecklistQualificationRepository checklistQualificationRepository) {
        this.checklistQualificationRepository = checklistQualificationRepository;
    }

    // Get all checklistQualifications paginated
    @Override
    public Page<ChecklistQualification> findAll(PageRequest pageRequest) {
        return checklistQualificationRepository.findAll(pageRequest);
    }

    // Get checklistQualification by ID or throw exception if not found
    @Override
    public ChecklistQualification getById(Long id) {
        return checklistQualificationRepository.findById(id).orElseThrow(() ->
                new CustomException("Team Scrum with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    // Update an existing checklistQualifications
    @Override
    public void update(ChecklistQualification entity) {
        this.checklistQualificationRepository.save(entity);
    }

    // Save a checklistQualifications (create or update)
    @Override
    public ChecklistQualification save(ChecklistQualification entity) {
        return checklistQualificationRepository.save(entity);
    }

    // Delete a checklistQualifications
    @Override
    public void delete(ChecklistQualification entity) {
        this.checklistQualificationRepository.delete(entity);
    }

    // Create a new checklistQualifications
    @Override
    public void create(ChecklistQualification entity) {
        this.checklistQualificationRepository.save(entity);
    }
}
