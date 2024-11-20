package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.DiarySustainations;
import com.api.aquilesApi.Repository.DiarySustainationsRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class DiarySustainationsService implements Idao<DiarySustainations, Long> {
    @Autowired
    private DiarySustainationsRepository diarySustainationsRepository;

    @Override
    public Page<DiarySustainations> findAll(PageRequest pageRequest) {
        return diarySustainationsRepository.findAll(pageRequest);
    }

    @Override
    public DiarySustainations getById(Long id) {
        return diarySustainationsRepository.findById(id).orElseThrow(() ->
                new CustomException("Diary Sustaination  with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(DiarySustainations entity) {
        this.diarySustainationsRepository.save(entity);
    }

    @Override
    public DiarySustainations save(DiarySustainations entity) {
        return diarySustainationsRepository.save(entity);
    }

    @Override
    public void delete(DiarySustainations entity) {
        this.diarySustainationsRepository.save(entity);
    }

    @Override
    public void create(DiarySustainations entity) {
        this.diarySustainationsRepository.save(entity);
    }
}
