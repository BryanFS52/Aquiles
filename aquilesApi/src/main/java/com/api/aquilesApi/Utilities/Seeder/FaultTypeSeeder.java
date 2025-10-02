package com.api.aquilesApi.Utilities.Seeder;

import com.api.aquilesApi.Entity.AttendanceState;
import com.api.aquilesApi.Entity.ImprovementPlanFaultType;
import com.api.aquilesApi.Repository.ImprovementPlanFaultTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class FaultTypeSeeder implements CommandLineRunner {

    private final ImprovementPlanFaultTypeRepository improvementPlanFaultTypeRepository;


    public FaultTypeSeeder(ImprovementPlanFaultTypeRepository improvementPlanFaultTypeRepository) {
        this.improvementPlanFaultTypeRepository = improvementPlanFaultTypeRepository;
    }

    @Override
    public void run(String... args) {
        createFaultTypeIfNotExists("Académica");
        createFaultTypeIfNotExists("Disciplinaria");
        createFaultTypeIfNotExists("Administrativa");
    }

    private void createFaultTypeIfNotExists(String name) {
        if (!improvementPlanFaultTypeRepository.existsByName(name)) {
            ImprovementPlanFaultType faultType = new ImprovementPlanFaultType();
            faultType.setName(name);
            improvementPlanFaultTypeRepository.save(faultType);
        }
    }
}
