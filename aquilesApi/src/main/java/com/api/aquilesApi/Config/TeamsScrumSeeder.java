package com.api.aquilesApi.Config;

import com.api.aquilesApi.Entity.TeamScrumMemberId;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.api.aquilesApi.Service.TeamScrumService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TeamsScrumSeeder implements CommandLineRunner {

    private final TeamScrumService teamScrumService;

    public TeamsScrumSeeder(TeamScrumService teamScrumService) {
        this.teamScrumService = teamScrumService;
    }

    @Override
    public void run(String... args) {
        try {
            // Si ya existen equipos, no sembrar
            var page = teamScrumService.findAll(PageRequest.of(0, 1));
            if (page != null && page.getTotalElements() > 0) {
                System.out.println("TeamsScrumSeeder: se detectaron teams existentes, no se sembrará.");
                return;
            }

            System.out.println("TeamsScrumSeeder: sembrando datos de ejemplo para TeamsScrum...");

            TeamsScrum team1 = TeamsScrum.builder()
                    .teamName("Equipo A")
                    .projectName("Proyecto Alpha")
                    .problem("Problema de ejemplo A")
                    .objectives("Objetivos A")
                    .description("Descripción del proyecto Alpha")
                    .projectJustification("Justificación del proyecto Alpha")
                    .studySheetId(1001L)
                    .memberIds(List.of(
                            new TeamScrumMemberId(101L, "PROFILE-101"),
                            new TeamScrumMemberId(102L, "PROFILE-102")
                    ))
                    .processMethodologyId("PM-1")
                    .build();

            TeamsScrum team2 = TeamsScrum.builder()
                    .teamName("Equipo B")
                    .projectName("Proyecto Beta")
                    .problem("Problema de ejemplo B")
                    .objectives("Objetivos B")
                    .description("Descripción del proyecto Beta")
                    .projectJustification("Justificación del proyecto Beta")
                    .studySheetId(1002L)
                    .memberIds(List.of(
                            new TeamScrumMemberId(103L, "PROFILE-103"),
                            new TeamScrumMemberId(104L, "PROFILE-104"),
                            new TeamScrumMemberId(105L, "PROFILE-105")
                    ))
                    .processMethodologyId("PM-2")
                    .build();

            teamScrumService.save(team1);
            teamScrumService.save(team2);

            System.out.println("TeamsScrumSeeder: datos sembrados correctamente.");
        } catch (Exception e) {
            System.err.println("TeamsScrumSeeder: error al sembrar datos: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
