package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.FinalReportEntity;
import com.api.aquilesApi.Repository.FinalReportRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class FinalReportService implements Idao<FinalReportEntity, Long> {

    private final FinalReportRepository finalReportRepository;

    public FinalReportService(FinalReportRepository finalReportRepository) {
        this.finalReportRepository = finalReportRepository;
    }

    @Override
    public Page<FinalReportEntity> findAll(PageRequest pageRequest) {
        return finalReportRepository.findAll(pageRequest);
    }


    @Override
    public FinalReportEntity getById(Long id) {
        return finalReportRepository.findById(id).orElseThrow(() ->
                new CustomException("FinalReport Type with id " + id + " not found", HttpStatus.NO_CONTENT));
    }


    @Override
    public void update(FinalReportEntity entity) {
        this.finalReportRepository.save(entity);
    }

    @Override
    public FinalReportEntity save(FinalReportEntity entity) {
        return finalReportRepository.save(entity);
    }

    @Override
    public void delete(FinalReportEntity entity) {
        this.finalReportRepository.delete(entity);
    }

    @Override
    public void create(FinalReportEntity entity) {
        this.finalReportRepository.save(entity);
    }
}
