package com.api.aquilesApi.Utilities.MapStruct;

import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamsScrum;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;

@Mapper
public interface TeamScrumMap {
    TeamScrumMap INSTANCE = Mappers.getMapper(TeamScrumMap.class);

    TeamsScrumDto teamScrumToTeamScrumDto(TeamsScrum teamsScrum);

    TeamsScrum teamScrumDtoToTeamScrum(TeamsScrumDto teamsScrumDto);

    List<TeamsScrumDto> teamScrumToTeamScrumDtos(List<TeamsScrum> teamsScrum);

    void updateTeamScrumFromDto(TeamsScrumDto dto, @MappingTarget TeamsScrum entity);

    default Page<TeamsScrumDto> teamScrumToTeamScrumDtoPage(Page<TeamsScrum> teamsScrumPage) {
        List<TeamsScrumDto> dtoList = teamScrumToTeamScrumDtos(teamsScrumPage.getContent());
        return new PageImpl<>(dtoList, teamsScrumPage.getPageable(), teamsScrumPage.getTotalElements());
    }
}