package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ChecklistSubstantiationListEntity;
import com.api.aquilesApi.Entity.DiarySustainationsEntity;
import com.api.aquilesApi.Repository.DiarySustainationsRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiarySustainationsService implements Idao<DiarySustainationsEntity, Long> {
    @Autowired
    private DiarySustainationsRepository diarySustainationsRepository;

    @Override
    public Page<DiarySustainationsEntity> findAll(PageRequest pageRequest) {
        return diarySustainationsRepository.findAll(pageRequest);
    }

    @Override
    public DiarySustainationsEntity getById(Long id) {
        return diarySustainationsRepository.findById(id).orElseThrow(() ->
                new CustomException("Diary Sustaination  with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(DiarySustainationsEntity entity) {
        this.diarySustainationsRepository.save(entity);
    }

    @Override
    public DiarySustainationsEntity save(DiarySustainationsEntity entity) {
        return diarySustainationsRepository.save(entity);
    }

    @Override
    public void delete(DiarySustainationsEntity entity) {
        this.diarySustainationsRepository.save(entity);
    }

    @Override
    public void create(DiarySustainationsEntity entity) {
        this.diarySustainationsRepository.save(entity);
    }
}
