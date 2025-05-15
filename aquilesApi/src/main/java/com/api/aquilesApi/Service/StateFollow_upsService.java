package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.StateFollow_upsEntity;
import com.api.aquilesApi.Repository.StateFollow_upsRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class StateFollow_upsService implements Idao <StateFollow_upsEntity , Long> {
    private final StateFollow_upsRepository stateFollowUpsRepository;

    public StateFollow_upsService(StateFollow_upsRepository stateFollowUpsRepository) {
        this.stateFollowUpsRepository = stateFollowUpsRepository;
    }

    @Override
    public Page<StateFollow_upsEntity> findAll(PageRequest pageRequest) {
        return stateFollowUpsRepository.findAll(pageRequest);
    }

    @Override
    public StateFollow_upsEntity getById(Long id) {
        return stateFollowUpsRepository.findById(id).orElseThrow(() ->
                new CustomException("State Follow Up with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(StateFollow_upsEntity entity) {
        this.stateFollowUpsRepository.save(entity);
    }

    @Override
    public StateFollow_upsEntity save(StateFollow_upsEntity entity) {
        return stateFollowUpsRepository.save(entity);
    }

    @Override
    public void delete(StateFollow_upsEntity entity) {
        this.stateFollowUpsRepository.delete(entity);
    }

    @Override
    public void create(StateFollow_upsEntity entity) {
        this.stateFollowUpsRepository.save(entity);
    }
}
