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

    @Query("SELECT ip FROM ImprovementPlan ip WHERE ip.studentId = :studentId")
    List<ImprovementPlan> findAllByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT ip.teacherCompetence FROM ImprovementPlan ip WHERE ip.teacherCompetence = :teacherCompetence")
    List<Long> findAllByTeacherCompetence(@Param("teacherCompetence") Long teacherCompetence);

    @Query("SELECT ip FROM ImprovementPlan ip WHERE ip.teacherCompetence = :teacherCompetence")
    Page<ImprovementPlan> searchByFilter(Pageable pageable, @Param("teacherCompetence") Long teacherCompetence);

    @Query("SELECT ip FROM ImprovementPlan ip WHERE ip.teacherCompetence = :teacherCompetence")
    List<ImprovementPlan> findByTeacherCompetence(@Param("teacherCompetence") Long teacherCompetence);

    // Plans de mejora por ficha (StudySheet): estudiante pertenece a equipos de esa ficha
    @Query("SELECT ip FROM ImprovementPlan ip WHERE ip.studentId IN (SELECT m.studentId FROM TeamsScrum t JOIN t.memberIds m WHERE t.studySheetId = :studySheetId)")
    Page<ImprovementPlan> findByStudySheetId(Pageable pageable, @Param("studySheetId") Long studySheetId);
}

