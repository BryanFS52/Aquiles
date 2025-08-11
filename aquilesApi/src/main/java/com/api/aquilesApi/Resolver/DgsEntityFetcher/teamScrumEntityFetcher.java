package com.api.aquilesApi.Resolver.DgsEntityFetcher;

import com.api.aquilesApi.Business.TeamsScrumBusiness;
import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.api.aquilesApi.Utilities.CustomException;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsEntityFetcher;
import org.modelmapper.ModelMapper;

import java.util.Map;

@DgsComponent
public class teamScrumEntityFetcher {

    private final ModelMapper modelMapper;
    private final TeamsScrumBusiness teamsScrumBusiness;

    public teamScrumEntityFetcher(ModelMapper modelMapper, TeamsScrumBusiness teamsScrumBusiness) {
        this.modelMapper = modelMapper;
        this.teamsScrumBusiness = teamsScrumBusiness;
    }

    @DgsEntityFetcher(name = "TeamsScrum")
    public TeamsScrum teamScrum(Map<String, Object> values) {
        try {

            Long id = values.get("id") != null ? Long.valueOf((String) values.get("id")) : null;
            TeamsScrumDto dto = teamsScrumBusiness.findById(id);
            return modelMapper.map(dto, TeamsScrum.class);
        } catch (CustomException e) {

            return null;
        }
    }
}
