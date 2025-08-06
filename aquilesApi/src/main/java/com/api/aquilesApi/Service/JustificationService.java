package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Justification;
import com.api.aquilesApi.Repository.JustificationRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

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
            // ✅ Usar el nuevo método que hace fetch de todas las relaciones
            return justificationRepository.findAll(pageRequest);
        } catch (Exception e) {
            // Fallback al método original si hay algún problema
            System.err.println("⚠️  Error using findAllWithRelations, falling back to regular findAll: " + e.getMessage());
            return justificationRepository.findAll(pageRequest);
        }
    }

    @Override
    public Justification getById(Long id) {
        try {
            // ✅ Intentar usar el método con relaciones primero
            Optional<Justification> justification = justificationRepository.findById(id);
            if (justification.isPresent()) {
                return justification.orElse(null);
            }
        } catch (Exception e) {
            System.err.println("⚠️  Error using findByIdWithRelations, falling back to regular findById: " + e.getMessage());
        }
        
        // Fallback al método original
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
}