package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Business.TeamsScrumBusiness;
import com.api.aquilesApi.Dto.Student;
import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamsScrum;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

@DgsComponent
public class TeamScrumStudentData {

    private final TeamsScrumBusiness teamsScrumBusiness;
    private final ModelMapper modelMapper;

    public TeamScrumStudentData(TeamsScrumBusiness teamsScrumBusiness, ModelMapper modelMapper) {
        this.teamsScrumBusiness = teamsScrumBusiness;

        this.modelMapper = modelMapper;
    }

    @DgsData(parentType = "Student", field = "teamScrums")
    public List<TeamsScrum> teamsScrum(DgsDataFetchingEnvironment env) {
        Student student = env.getSource();
        assert student != null;
        Long studentId = student.getId();

        List<TeamsScrumDto> teamsScrumDtoList = teamsScrumBusiness.findAllByStudentId(studentId);

        return teamsScrumDtoList.stream()
                .map(dto -> modelMapper.map(dto, TeamsScrum.class))
                .collect(Collectors.toList());
    }
}
