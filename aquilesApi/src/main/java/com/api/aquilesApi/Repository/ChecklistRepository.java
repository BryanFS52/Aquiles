package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ChecklistSubstantiationListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChecklistSubstantiationListRepository extends JpaRepository<ChecklistSubstantiationListEntity , Long> {
}
