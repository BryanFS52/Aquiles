package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ImprovementPlanDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImprovementPlanDeliveryRepository extends JpaRepository<ImprovementPlanDelivery, Long> {

    boolean existsByDeliveryFormat(String deliveryFormat);
}