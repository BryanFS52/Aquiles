package com.api.aquilesApi.Repository;


import com.api.aquilesApi.Entity.ImprovementPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImprovementPlanRepository extends JpaRepository<ImprovementPlan, Long> {

    boolean existsByStudentIdAndStateTrue(Long studentId);

    boolean existsByActNumber(String actNumber);

    @Query("SELECT ip FROM ImprovementPlan ip WHERE ip.studentId = :studentId")
    List<ImprovementPlan> findAllByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT ip.teacherCompetence FROM ImprovementPlan ip WHERE ip.teacherCompetence = :teacherCompetence")
    List<Long> findAllByTeacherCompetence(@Param("teacherCompetence") Long teacherCompetence);

    @Query("SELECT ip FROM ImprovementPlan ip WHERE ip.teacherCompetence = :teacherCompetence")
    Page<ImprovementPlan> searchByFilter(Pageable pageable, @Param("teacherCompetence") Long teacherCompetence);

    @Query("SELECT ip FROM ImprovementPlan ip WHERE ip.teacherCompetence = :teacherCompetence")
    List<ImprovementPlan> findByTeacherCompetence(@Param("teacherCompetence") Long teacherCompetence);

    // Find ImprovementPlans by list of TeacherCompetence IDs
    @Query("SELECT ip FROM ImprovementPlan ip WHERE ip.teacherCompetence IN :teacherCompetenceIds")
    Page<ImprovementPlan> findByTeacherCompetenceIds(Pageable pageable, @Param("teacherCompetenceIds") List<Long> teacherCompetenceIds);

    @Query("SELECT ip FROM ImprovementPlan ip WHERE ip.learningOutcome = :learningOutcome")
    List<ImprovementPlan> findAllByLearningOutcome(@Param("learningOutcome") Long learningOutcome);
}
