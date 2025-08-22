package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import org.modelmapper.ModelMapper;
import java.util.Map;

@DgsComponent
public class StudySheetTeamScrumData {

    private final ModelMapper modelMapper;

    public StudySheetTeamScrumData(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @DgsData(parentType = "TeamsScrum", field = "studySheet")
    public Map<String, Object> resolveStudySheet(DgsDataFetchingEnvironment env) {
        Object source = env.getSource();
        assert source != null;


        TeamsScrum teamsScrum;
        if (source instanceof TeamsScrumDto) {
            teamsScrum = modelMapper.map((TeamsScrumDto) source, TeamsScrum.class);
        } else {
            teamsScrum = (TeamsScrum) source;
        }

        if (teamsScrum == null || teamsScrum.getStudySheetId() == null) {
            return null;
        }

        return Map.of("id", teamsScrum.getStudySheetId().toString());
    }
}
