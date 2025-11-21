package com.api.aquilesApi.Service;

import com.api.aquilesApi.Entity.ImprovementPlan;
import com.api.aquilesApi.Repository.ImprovementPlanRepository;
import com.api.aquilesApi.Service.Dao.Idao;
import com.api.aquilesApi.Utilities.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class ImprovementPlanService implements Idao<ImprovementPlan, Long> {

    private final ImprovementPlanRepository improvementPlanRepository;

    public ImprovementPlanService(ImprovementPlanRepository improvementPlanRepository) {
        this.improvementPlanRepository = improvementPlanRepository;
    }

    @Override
    public Page<ImprovementPlan> findAll(PageRequest pageRequest) {
        return improvementPlanRepository.findAll(pageRequest);
    }



    public Page<ImprovementPlan> findByFilter(PageRequest pageRequest, Long teacherCompetence) {
        return improvementPlanRepository.searchByFilter(pageRequest, teacherCompetence);
    }

    

    public Page<ImprovementPlan> findAll(Pageable pageable) {
        return improvementPlanRepository.findAll(pageable);
    }

    public Page<ImprovementPlan> findByStudySheetId(PageRequest pageRequest, Long studySheetId) {
        return improvementPlanRepository.findByStudySheetId(pageRequest, studySheetId);
    }

    @Override
    public ImprovementPlan getById(Long id) {
        return improvementPlanRepository.findById(id)
                .orElseThrow(() -> new CustomException(
                        "Improvement Plan with id " + id + " not found",
                        HttpStatus.NO_CONTENT
                ));
    }

    public List<ImprovementPlan> findAllByStudentId(Long id) {
        return improvementPlanRepository.findAllByStudentId(id);
    }

    @Override
    public void update(ImprovementPlan entity) {
        entity.setActNumber(generateUniqueActNumber());
        improvementPlanRepository.save(entity);
    }

    @Override
    public ImprovementPlan save(ImprovementPlan entity) {
        if (entity.getActNumber() == null || entity.getActNumber().trim().isEmpty()) {
            entity.setActNumber(generateUniqueActNumber());
        }
        return improvementPlanRepository.save(entity);
    }

    @Override
    public void delete(ImprovementPlan entity) {
        improvementPlanRepository.delete(entity);
    }

    @Override
    public void create(ImprovementPlan entity) {
        improvementPlanRepository.save(entity);
    }

    public boolean existsActivePlanForStudent(Long studentId) {
        return improvementPlanRepository.existsByStudentIdAndStateTrue(studentId);
    }

    public List<ImprovementPlan> findImprovementPlansByTeacherCompetence(Long teacherCompetence) {
        return improvementPlanRepository.findByTeacherCompetence(teacherCompetence);
    }

    public List<Long> findAllByTeacherCompetence(Long teacherCompetence) {
        return improvementPlanRepository.findAllByTeacherCompetence(teacherCompetence);
    }

    public List<ImprovementPlan> findAllByLearningOutcome(Long learningOutcome) {
        return improvementPlanRepository.findAllByLearningOutcome(learningOutcome);
    }

    private String generateUniqueActNumber() {
        String actNumber;
        do {
            actNumber = "ACT-" + generateRandomAlphanumeric(4);
        } while (improvementPlanRepository.existsByActNumber(actNumber));
        return actNumber;
    }

    private String generateRandomAlphanumeric(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}