package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Evaluations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationsRepository extends JpaRepository<Evaluations, Long> {
    
    @Query("SELECT e FROM Evaluations e WHERE e.id IN (SELECT c.evaluation.id FROM Checklist c WHERE c.id = :checklistId AND c.evaluation IS NOT NULL)")
    List<Evaluations> findByChecklistId(@Param("checklistId") Long checklistId);
}
