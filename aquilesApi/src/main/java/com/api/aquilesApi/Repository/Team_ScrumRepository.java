package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Teams_ScrumEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Team_ScrumRepository extends JpaRepository<Teams_ScrumEntity , Long> {
}
