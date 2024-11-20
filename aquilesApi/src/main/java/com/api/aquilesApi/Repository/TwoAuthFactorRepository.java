package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.TwoAuthFactorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TwoAuthFactorRepository extends JpaRepository<TwoAuthFactorEntity , Long> {
}
