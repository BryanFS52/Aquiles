package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Evaluations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationsRepository extends JpaRepository<Evaluations, Long> {

    // Buscar evaluaciones por checklist ID usando la nueva relación 1:1
    // JPA genera automáticamente esta consulta basada en el nombre del método
    List<Evaluations> findByChecklistId(Long checklistId);

    // Verificar si existe una evaluación para un checklist específico
    boolean existsByChecklistId(Long checklistId);

    // Buscar la evaluación única de un checklist (relación 1:1)
    // Como la relación es 1:1, debería devolver un solo resultado
    Evaluations findEvaluationByChecklistId(Long checklistId);
}