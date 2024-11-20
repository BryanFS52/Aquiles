package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ChecklistSubstantiationList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChecklistSubstantiationListRepository extends JpaRepository<ChecklistSubstantiationList, Long> {
}
