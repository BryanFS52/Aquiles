package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.Follow_upsEntity;
import com.api.aquilesApi.Entity.StateFollow_upsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Follow_upsRepository extends JpaRepository<Follow_upsEntity , Long> {

}
