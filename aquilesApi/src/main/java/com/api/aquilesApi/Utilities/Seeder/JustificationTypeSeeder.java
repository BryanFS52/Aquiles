package com.api.aquilesApi.Utilities.Seeder;

import com.api.aquilesApi.Entity.JustificationType;
import com.api.aquilesApi.Repository.JustificationTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class JustificationTypeSeeder implements CommandLineRunner {

    private final JustificationTypeRepository justificationTypeRepository;

    public JustificationTypeSeeder(JustificationTypeRepository justificationTypeRepository) {
        this.justificationTypeRepository = justificationTypeRepository;
    }

    @Override
    public void run(String... args) {
        createTypeIfNotExists("Calamidad", "Ausencia por calamidad doméstica");
        createTypeIfNotExists("Médica", "Ausencia por cita médica");
        createTypeIfNotExists("Otra", "Ausencia por otro motivo");
    }

    private void createTypeIfNotExists(String name, String description) {
        if (!justificationTypeRepository.existsByNameIgnoreCase(name)) {
            JustificationType type = new JustificationType();
            type.setName(name);
            type.setDescription(description);
            justificationTypeRepository.save(type);
        }
    }
}
