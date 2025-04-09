package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.NotificationsTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationsTypeRepository extends JpaRepository<NotificationsTypeEntity, Long> {
}
