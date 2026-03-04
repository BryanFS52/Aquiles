package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Business.TeamsScrumBusiness;
import com.api.aquilesApi.Dto.StudySheet;
import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

@DgsComponent
public class TeamsScrumStudySheetData {

    private final ModelMapper modelMapper;
    private final TeamsScrumBusiness teamsScrumBusiness;

    public TeamsScrumStudySheetData(ModelMapper modelMapper, TeamsScrumBusiness teamsScrumBusiness) {
        this.modelMapper = modelMapper;
        this.teamsScrumBusiness = teamsScrumBusiness;
    }

    @DgsData(parentType = "StudySheet", field = "teamsScrum")
    public List<TeamsScrum> teamScrums(DgsDataFetchingEnvironment dfe) {
        StudySheet studySheet = dfe.getSource();
        assert studySheet != null;
        Long studySheetId = studySheet.getId();

        List<TeamsScrumDto> dtos = teamsScrumBusiness.findAllByStudySheetId(studySheetId);

        return dtos.stream()
                .map(dto -> modelMapper.map(dto, TeamsScrum.class))
                .collect(Collectors.toList());
    }
}
