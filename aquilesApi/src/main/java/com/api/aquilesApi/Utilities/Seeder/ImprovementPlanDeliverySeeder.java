package com.api.aquilesApi.Utilities.Seeder;

import com.api.aquilesApi.Entity.ImprovementPlanDelivery;
import com.api.aquilesApi.Repository.ImprovementPlanDeliveryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class ImprovementPlanDeliverySeeder implements CommandLineRunner {

    private final ImprovementPlanDeliveryRepository improvementPlanDeliveryRepository;

    public ImprovementPlanDeliverySeeder(ImprovementPlanDeliveryRepository improvementPlanDeliveryRepository) {
        this.improvementPlanDeliveryRepository = improvementPlanDeliveryRepository;
    }

    @Override
    public void run(String... args) {
        createDeliveryIfNotExists("Físico");
        createDeliveryIfNotExists("Digital");
    }

    private void createDeliveryIfNotExists(String deliveryFormat) {
        if(!improvementPlanDeliveryRepository.existsByDeliveryFormat(deliveryFormat)) {
            ImprovementPlanDelivery improvementPlanDelivery = new ImprovementPlanDelivery();
            improvementPlanDelivery.setDeliveryFormat(deliveryFormat);
            LocalDate date = "Físico".equals(deliveryFormat) ? LocalDate.now() : LocalDate.now().plusDays(1);
            improvementPlanDelivery.setFinalDeliveryDate(date);
            improvementPlanDeliveryRepository.save(improvementPlanDelivery);
        }
    }
}
