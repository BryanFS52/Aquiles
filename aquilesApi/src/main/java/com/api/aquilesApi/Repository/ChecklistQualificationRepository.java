package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ChecklistQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChecklistQualificationRepository extends JpaRepository<ChecklistQualification, Long> {
}
