package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.Follow_upsEntity;
import com.api.aquilesApi.Entity.StateFollow_upsEntity;
import com.api.aquilesApi.Repository.Follow_upsRepository;
import com.api.aquilesApi.Repository.StateFollow_upsRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class Follow_upsService implements Idao<Follow_upsEntity , Long> {
    private final Follow_upsRepository followUpsRepository;
    private final StateFollow_upsRepository stateFollowUpsRepository;

    public Follow_upsService(Follow_upsRepository followUpsRepository, StateFollow_upsRepository stateFollowUpsRepository) {
        this.followUpsRepository = followUpsRepository;
        this.stateFollowUpsRepository = stateFollowUpsRepository;
    }

    @Override
    public Page<Follow_upsEntity> findAll(PageRequest pageRequest) {
        return followUpsRepository.findAll(pageRequest);
    }

    @Override
    public Follow_upsEntity getById(Long id) {
        return followUpsRepository.findById(id).orElseThrow(() ->
                new CustomException("Follow Up with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(Follow_upsEntity entity) {
        this.followUpsRepository.save(entity);
    }

    @Override
    public Follow_upsEntity save(Follow_upsEntity entity) {
        return followUpsRepository.save(entity);
    }

    @Override
    public void delete(Follow_upsEntity entity) {
        this.followUpsRepository.delete(entity);
    }

    @Override
    public void create(Follow_upsEntity entity) {
        this.followUpsRepository.save(entity);
    }

    // Método para buscar el estado por ID
    public StateFollow_upsEntity findStateById(Long stateFollowUpId) {
        return stateFollowUpsRepository.findById(stateFollowUpId)
                .orElseThrow(() -> new CustomException("Estado Follow Up con ID " + stateFollowUpId + " no encontrado", HttpStatus.NO_CONTENT));
    }
}
