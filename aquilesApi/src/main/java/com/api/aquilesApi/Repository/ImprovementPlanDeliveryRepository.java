package com.api.aquilesApi.Repository;

import com.api.aquilesApi.Entity.ImprovementPlanDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImprovementPlanDeliveryRepository extends JpaRepository<ImprovementPlanDelivery, Long> {

    // Method to check if a delivery format exists
    boolean existsByDeliveryFormat(String deliveryFormat);
}