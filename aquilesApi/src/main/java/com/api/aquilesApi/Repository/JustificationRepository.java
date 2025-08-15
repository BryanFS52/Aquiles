package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Justification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JustificationRepository extends JpaRepository<Justification, Long> {
    
    // Buscar justificaciones por ficha de estudio (studySheetQuarter)
    @Query("""
        SELECT j FROM Justification j 
        INNER JOIN j.attendance a 
        WHERE a.studySheetQuarter = :studySheetId
        ORDER BY j.absenceDate DESC
    """)
    List<Justification> findByStudySheetId(@Param("studySheetId") Long studySheetId);
}