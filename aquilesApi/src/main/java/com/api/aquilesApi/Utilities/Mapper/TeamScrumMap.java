package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.TeamsScrumDto;
import com.api.aquilesApi.Entity.TeamsScrum;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, uses = {FIleMapper.class})
public interface TeamScrumMap {
    TeamScrumMap INSTANCE = Mappers.getMapper(TeamScrumMap.class);

    TeamsScrumDto EntityToDto(TeamsScrumDto teamsScrum);

    TeamsScrum DtoToEntity(TeamsScrumDto teamsScrum);

    List<TeamsScrumDto> EntityToDtoList(List<TeamsScrum> teamsScrums);

    void updateTeamScrum(TeamsScrumDto teamsScrumDto, @MappingTarget TeamsScrum teamsScrum);

    default Page<TeamsScrumDto> EntityToDtoList(Page<TeamsScrum> teamsScrums) {
        List<TeamsScrumDto> dtos = EntityToDtoList(teamsScrums.getContent());
        return new PageImpl<>(dtos, teamsScrums.getPageable(), teamsScrums.getTotalElements());
    }
}
