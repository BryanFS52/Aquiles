package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import org.modelmapper.ModelMapper;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@DgsComponent
public class studentsTeamScrumData {
    private final ModelMapper modelMapper;

    public studentsTeamScrumData(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @DgsData(parentType = "TeamsScrum", field = "students")
    public List<Map<String, String>> studentsReference(DgsDataFetchingEnvironment env) {
        Object source = env.getSource();
        TeamsScrum teamsScrum;

        if (source instanceof TeamsScrumDto) {
            teamsScrum = modelMapper.map((TeamsScrumDto) source, TeamsScrum.class);
        } else if (source instanceof TeamsScrum) {
            teamsScrum = (TeamsScrum) source;
        } else {
            return Collections.emptyList();
        }

        if (teamsScrum.getMemberIds() == null || teamsScrum.getMemberIds().isEmpty()) {
            return Collections.emptyList();
        }

        return teamsScrum.getMemberIds().stream()
                .map(member -> Map.of(
                        "id", member.getStudentId().toString(),
                        "teamId", teamsScrum.getId().toString()  // 🔹 Inyectamos el contexto
                ))
                .collect(Collectors.toList());

    }
}
