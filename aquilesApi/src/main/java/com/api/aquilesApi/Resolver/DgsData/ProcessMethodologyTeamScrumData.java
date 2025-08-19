package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import org.modelmapper.ModelMapper;

import java.util.Map;

@DgsComponent
public class ProcessMethodologyTeamScrumData {

    private final ModelMapper modelMapper;

    public ProcessMethodologyTeamScrumData(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @DgsData(parentType = "TeamsScrum", field = "processMethodology")
    public Map<String, Object> resolveProcessMethodology(DgsDataFetchingEnvironment env) {
        TeamsScrum teamsScrum = (env.getSource() instanceof TeamsScrumDto)
                ? modelMapper.map(env.getSource(), TeamsScrum.class)
                : (TeamsScrum) env.getSource();

        if (teamsScrum == null || teamsScrum.getProcessMethodologyId() == null) {
            return null;
        }

        return Map.of("id", teamsScrum.getProcessMethodologyId());
    }
}
