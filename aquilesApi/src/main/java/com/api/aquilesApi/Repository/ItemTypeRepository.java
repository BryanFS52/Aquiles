package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ItemTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemTypeRepository extends JpaRepository<ItemTypeEntity, Long> {
}
