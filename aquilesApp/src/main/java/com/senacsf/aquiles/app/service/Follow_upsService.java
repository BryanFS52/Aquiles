package com.senacsf.aquiles.app.service;

import com.senacsf.aquiles.app.entities.Follow_ups;
import com.senacsf.aquiles.app.repository.ExcusesRepository;
import com.senacsf.aquiles.app.repository.Follow_upsRepository;
import com.senacsf.aquiles.app.service.dao.Idao;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class Follow_upsService implements Idao<Follow_ups, Long> {

    @Autowired
    Follow_upsRepository followUpsRepository;

    @Autowired
    ExcusesRepository excusesRepository;

    @Override
    public List<Follow_ups> findAll() {
        return List.of();
    }

    @Override
    public Follow_ups getById(Long aLong) {
        return null;
    }

    @Override
    public void update(Follow_ups entity) {
        this.followUpsRepository.save(entity);
    }

    @Override
    public Follow_ups save(Follow_ups entity) {
        return this.followUpsRepository.save(entity);
    }

    @Override
    public void create(Follow_ups entity) {
        this.followUpsRepository.save(entity);
    }

    @Override
    public void delete(Follow_ups entity) {
        this.followUpsRepository.delete(entity);
    }
}
