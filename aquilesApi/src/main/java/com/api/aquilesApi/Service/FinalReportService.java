package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.FinalReport;
import com.api.aquilesApi.Repository.FinalReportRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class FinalReportService implements Idao<FinalReport, Long> {

    private final FinalReportRepository finalReportRepository;

    public FinalReportService(FinalReportRepository finalReportRepository) {
        this.finalReportRepository = finalReportRepository;
    }

    @Override
    public Page<FinalReport> findAll(PageRequest pageRequest) {
        return finalReportRepository.findAll(pageRequest);
    }


    @Override
    public FinalReport getById(Long id) {
        return finalReportRepository.findById(id).orElseThrow(() ->
                new CustomException("FinalReport Type with id " + id + " not found", HttpStatus.NO_CONTENT));
    }


    @Override
    public void update(FinalReport entity) {
        this.finalReportRepository.save(entity);
    }

    @Override
    public FinalReport save(FinalReport entity) {
        return finalReportRepository.save(entity);
    }

    @Override
    public void delete(FinalReport entity) {
        this.finalReportRepository.delete(entity);
    }

    @Override
    public void create(FinalReport entity) {
        this.finalReportRepository.save(entity);
    }
}
