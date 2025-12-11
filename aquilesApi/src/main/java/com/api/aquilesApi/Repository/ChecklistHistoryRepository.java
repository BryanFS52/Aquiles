package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ChecklistHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChecklistHistoryRepository extends JpaRepository<ChecklistHistory, Long> {
    // Find all checklist history records by checklist ID
    List<ChecklistHistory> findByChecklistId(Long checklistId);
}