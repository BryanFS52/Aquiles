package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ExcusesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExcusesRepository extends JpaRepository<ExcusesEntity , Long> {
    boolean existsByExcuseDocument(String excuseDocument);
}
