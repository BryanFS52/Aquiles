package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.StudySheet;
import com.api.aquilesApi.Repository.StudySheetRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class StudySheetService implements Idao<StudySheet, Long> {

    @Autowired
    private StudySheetRepository studySheetRepository;

    @Override
    public StudySheet getById(Long id) {
        return studySheetRepository.findById(id).orElseThrow(() ->
                new CustomException("Study Sheet with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Transactional
    @Override
    public StudySheet save(StudySheet obje) {
        return studySheetRepository.save(obje);
    }

    @Transactional
    @Override
    public void create(StudySheet entity) {
        this.save(entity); // Llama a save para manejar la creación
    }

    @Transactional
    @Override
    public void update(StudySheet entity) {
        this.save(entity); // Llama a save para manejar la actualización
    }

    @Transactional
    @Override
    public void delete(StudySheet obje) {
        studySheetRepository.delete(obje);
    }

    @Override
    public Page<StudySheet> findAll(PageRequest pageRequest) {
        return studySheetRepository.findAll(pageRequest);
    }

    public boolean existsNumber(Integer number) {
        return studySheetRepository.existsByNumber(number);
    }

    public boolean existsNum(Integer num) {
        return studySheetRepository.existsByNum(num);
    }
}
