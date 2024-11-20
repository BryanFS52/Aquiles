package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.TwoAuthFactorEntity;
import com.api.aquilesApi.Repository.TwoAuthFactorRepository;
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
public class TwoAuthFactorService implements Idao<TwoAuthFactorEntity , Long> {
    @Autowired
    private TwoAuthFactorRepository twoAuthFactorRepository;


    @Override
    public Page<TwoAuthFactorEntity> findAll(PageRequest pageRequest) {
        return twoAuthFactorRepository.findAll(pageRequest);
    }

    @Override
    public TwoAuthFactorEntity getById(Long id) {
        return twoAuthFactorRepository.findById(id).orElseThrow(() ->
                new CustomException("2FA with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(TwoAuthFactorEntity entity) {
        this.twoAuthFactorRepository.save(entity);
    }

    @Override
    public TwoAuthFactorEntity save(TwoAuthFactorEntity entity) {
        return twoAuthFactorRepository.save(entity);
    }

    @Override
    public void delete(TwoAuthFactorEntity entity) {
        this.twoAuthFactorRepository.delete(entity);
    }

    @Override
    public void create(TwoAuthFactorEntity entity) {
        this.twoAuthFactorRepository.save(entity);
    }
}
