package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.TeamsScrumEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamScrumRepository extends JpaRepository<TeamsScrumEntity, Long> {
}
