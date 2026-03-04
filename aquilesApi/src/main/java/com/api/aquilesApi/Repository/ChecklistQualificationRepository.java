package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ChecklistQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChecklistQualificationRepository extends JpaRepository<ChecklistQualification, Long> {
    
    // Buscar calificación por itemId, teamScrumId y checklistId
    Optional<ChecklistQualification> findByItem_IdAndTeamsScrum_IdAndChecklist_Id(
        Long itemId, Long teamScrumId, Long checklistId
    );
    
    // Buscar todas las calificaciones de un checklist para un team scrum
    List<ChecklistQualification> findByChecklist_IdAndTeamsScrum_Id(Long checklistId, Long teamScrumId);
}
