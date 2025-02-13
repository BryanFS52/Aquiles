package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.DiarySustainationsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiarySustainationsRepository extends JpaRepository<DiarySustainationsEntity , Long> {
}
