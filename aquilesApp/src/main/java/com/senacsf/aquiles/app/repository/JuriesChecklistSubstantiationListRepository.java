package com.senacsf.aquiles.app.repository;

import com.senacsf.aquiles.app.entities.JuriesChecklistSubstantiationList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JuriesChecklistSubstantiationListRepository extends JpaRepository<JuriesChecklistSubstantiationList, Long> {
}
