package com.api.aquilesApi.Utilities.Seeder;

import com.api.aquilesApi.Entity.ImprovementPlanEvidenceType;
import com.api.aquilesApi.Repository.ImprovementPlanEvidenceTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ImprovementPlanEvidenceTypeSeeder implements CommandLineRunner {

    private final ImprovementPlanEvidenceTypeRepository improvementPlanEvidenceTypeRepository;

    public ImprovementPlanEvidenceTypeSeeder(ImprovementPlanEvidenceTypeRepository improvementPlanEvidenceTypeRepository) {
        this.improvementPlanEvidenceTypeRepository = improvementPlanEvidenceTypeRepository;
    }

    @Override
    public void run(String... args) {
        createEvidenceTypeIfNotExists("Conocimiento");
        createEvidenceTypeIfNotExists("Desempeño");
        createEvidenceTypeIfNotExists("Producto");
    }

    private void createEvidenceTypeIfNotExists(String name) {
        if (!improvementPlanEvidenceTypeRepository.existsByName(name)) {
            ImprovementPlanEvidenceType evidenceType = new ImprovementPlanEvidenceType();
            evidenceType.setName(name);
            improvementPlanEvidenceTypeRepository.save(evidenceType);
        }
    }
}
