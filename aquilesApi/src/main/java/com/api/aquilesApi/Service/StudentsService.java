package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.StudentsEntity;
import com.api.aquilesApi.Repository.StudentsRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class StudentsService implements Idao<StudentsEntity , Long> {
    private final StudentsRepository studentsRepository;

    public StudentsService(StudentsRepository studentsRepository) {
        this.studentsRepository = studentsRepository;
    }

    public StudentsEntity findByDocument_Number(Long documentNumber){
        return studentsRepository.findByDocumentNumber(documentNumber);
    }


    @Override
    public Page<StudentsEntity> findAll(PageRequest pageRequest) {
        return studentsRepository.findAll(pageRequest);
    }

    @Override
    public StudentsEntity getById(Long id) {
        return studentsRepository.findById(id).orElseThrow(() ->
                new CustomException("Student with id " + id + " not found", HttpStatus.NO_CONTENT));
    }

    @Override
    public void update(StudentsEntity entity) {
        this.studentsRepository.save(entity);
    }

    @Override
    public StudentsEntity save(StudentsEntity entity) {
        return studentsRepository.save(entity);
    }

    @Override
    public void delete(StudentsEntity entity) {
        this.studentsRepository.save(entity);
    }

    @Override
    public void create(StudentsEntity entity) {
        this.studentsRepository.save(entity);
    }
}
