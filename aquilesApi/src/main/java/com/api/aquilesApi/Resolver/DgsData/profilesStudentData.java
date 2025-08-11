package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Business.TeamsScrumBusiness;
import com.api.aquilesApi.Dto.TeamScrumMemberIdDto;
import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@DgsComponent
public class profilesStudentData {
    private final TeamsScrumBusiness  teamsScrumBusiness;

    public profilesStudentData(TeamsScrumBusiness teamsScrumBusiness) {
        this.teamsScrumBusiness = teamsScrumBusiness;
    }
    @DgsData(parentType = "Student", field = "profiles")
    public List<Map<String, String>> studentsReference(DgsDataFetchingEnvironment env) {
        Map<String, Object> source = env.getSource();
        assert source != null;

        Long studentId = Long.parseLong((String) source.get("id"));
        // 🔹 Leer teamId del source
        Long teamId = source.containsKey("teamId") ? Long.parseLong((String) source.get("teamId")) : null;

        if (teamId == null) {
            // Si no tenemos el teamId, no podemos filtrar correctamente
            return List.of();
        }

        // Obtener el equipo actual del estudiante
        TeamsScrumDto team = teamsScrumBusiness.findAllByStudentId(studentId).stream()
                .filter(t -> Objects.equals(t.getId(), teamId))
                .findFirst()
                .orElse(null);

        if (team == null) {
            return List.of();
        }

        // 🔹 Map para evitar duplicados por ficha (StudySheet)
        Map<Long, String> profileBySheet = new HashMap<>();

        Long sheetId = team.getStudySheetId();
        team.getMemberIds().stream()
                .filter(member -> Objects.equals(member.getStudentId(), studentId))
                .map(TeamScrumMemberIdDto::getProfileId)
                .filter(Objects::nonNull)
                .findFirst() // Tomamos solo el primero
                .ifPresent(profileId -> {
                    if (sheetId != null) {
                        profileBySheet.putIfAbsent(sheetId, profileId);
                    }
                });

        // 🔹 Convertir a la respuesta esperada por GraphQL
        return profileBySheet.values().stream()
                .map(profileId -> Map.of("id", profileId))
                .toList();
    }


}
