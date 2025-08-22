package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Justification;
import com.api.aquilesApi.Repository.JustificationRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JustificationService implements Idao<Justification, Long> {

    private final JustificationRepository justificationRepository;

    public JustificationService(JustificationRepository justificationRepository) {
        this.justificationRepository = justificationRepository;
    }

    @Override
    public Page<Justification> findAll(PageRequest pageRequest) {
        try {
            return justificationRepository.findAll(pageRequest);
        } catch (Exception e) {
            System.err.println("Error using findAllWithRelations, falling back to regular findAll: " + e.getMessage());
            return justificationRepository.findAll(pageRequest);
        }
    }

    @Override
    public Justification getById(Long id) {
        try {
            Optional<Justification> justification = justificationRepository.findById(id);
            if (justification.isPresent()) {
                return justification.orElse(null);
            }
        } catch (Exception e) {
            System.err.println("Error using findByIdWithRelations, falling back to regular findById: " + e.getMessage());
        }

        return justificationRepository.findById(id).orElseThrow(() ->
                new CustomException("Justification with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void create(Justification entity) {
        this.justificationRepository.save(entity);
    }

    @Override
    public void update(Justification entity) {
        this.justificationRepository.save(entity);
    }

    @Override
    public Justification save(Justification entity) {
        return justificationRepository.save(entity);
    }

    @Override
    public void delete(Justification entity) {
        this.justificationRepository.delete(entity);
    }

    //Justification by attendance by Student ID
    public List<Justification> findByStudentId(Long studentId) {
        return justificationRepository.findAllByAttendanceStudentId(studentId);
    }
}