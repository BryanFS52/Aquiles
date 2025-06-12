package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ChecklistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChecklistRepository extends JpaRepository<ChecklistEntity, Long> {
}
