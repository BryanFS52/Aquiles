package com.api.aquilesApi.Utilities.Seeder;

import com.api.aquilesApi.Entity.JustificationStatus;
import com.api.aquilesApi.Repository.JustificationStatusRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class JustificationStatusSeeder implements CommandLineRunner {

    private final JustificationStatusRepository justificationStatusRepository;

    public JustificationStatusSeeder(JustificationStatusRepository justificationStatusRepository) {
        this.justificationStatusRepository = justificationStatusRepository;
    }

    @Override
    public void run(String... args) {
        createStatusIfNotExists("Aceptado", true);
        createStatusIfNotExists("Denegado", true);
        createStatusIfNotExists("En proceso", true);
    }

    private void createStatusIfNotExists(String name, boolean state) {
        if (!justificationStatusRepository.existsByName(name)) {
            JustificationStatus status = new JustificationStatus();
            status.setName(name);
            status.setState(state);
            justificationStatusRepository.save(status);
        }
    }
}
